package main

import (
	pbOrder "api-gateway/order"
	pbProduct "api-gateway/product"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/juju/ratelimit"
	"google.golang.org/grpc"
	"log"
	"net/http"
	"time"
)

// Secret key used to sign the JWT tokens
var jwtSecret = []byte("nopadox190@altpano.com")

var rateLimiter = ratelimit.NewBucketWithRate(1, 5) // 1 request per second, 5 burst

func RateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if rateLimiter.TakeAvailable(1) == 0 {
			c.JSON(429, gin.H{"error": "Too many requests"})
			c.Abort()
			return
		}
		c.Next()
	}
}

// GenerateJWT generates a new JWT token for testing
func GenerateJWT() (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": "testuser",
		"exp":      time.Now().Add(time.Hour * 1).Unix(), // Token expires in 1 hour
	})

	// Sign the token with the secret key
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// JWTAuthMiddleware is a middleware function for JWT authentication
func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the token from the Authorization header
		tokenString := c.GetHeader("Authorization")

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			c.Abort()
			return
		}

		// Parse and validate the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.NewValidationError("unexpected signing method", jwt.ValidationErrorSignatureInvalid)
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Continue to the next handler if authentication is successful
		c.Next()
	}
}

func connectToProductService() pbProduct.ProductServiceClient {
	conn, err := grpc.Dial("0.0.0.0:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Failed to connect to Product service: %v", err)
	}
	return pbProduct.NewProductServiceClient(conn)
}

func connectToOrderService() pbOrder.OrderServiceClient {
	conn, err := grpc.Dial("order-service:50052", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Failed to connect to Order service: %v", err)
	}
	return pbOrder.NewOrderServiceClient(conn)
}

func main() {
	r := gin.Default()

	// Public route for testing JWT generation
	r.GET("/token", func(c *gin.Context) {
		token, err := GenerateJWT()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": token})
	})

	// Apply JWTAuthMiddleware globally for all routes except the /token endpoint
	r.Use(JWTAuthMiddleware())

	productClient := connectToProductService()
	orderClient := connectToOrderService()

	// Protected route to get a product by ID
	r.GET("/products/:id", func(c *gin.Context) {
		id := c.Param("id")
		req := &pbProduct.GetProductRequest{Id: id}
		res, err := productClient.GetProduct(c, req)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, res)
	})

	// Protected route to create a new order
	r.POST("/orders", func(c *gin.Context) {
		var order pbOrder.Order
		if err := c.ShouldBindJSON(&order); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		req := &pbOrder.PlaceOrderRequest{
			CustomerId: order.CustomerId,
			Items:      order.Items,
		}
		res, err := orderClient.PlaceOrder(c, req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// Add more protected routes here as needed
	// e.g., handling orders, other product endpoints, etc.

	r.Run(":8080") // Start the API Gateway on port 8080
}