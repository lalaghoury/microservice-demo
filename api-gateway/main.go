package main

// We can add any package using the go add command and the package name or we can install all the dependencies using the go install command.
import (
	pbOrder "api-gateway/order"     // this is made by me but it is not in the order service (no proto made).
	pbProduct "api-gateway/product" // the path to the proto file of product service
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/juju/ratelimit"
	"google.golang.org/grpc"
)

// Secret key used to sign the JWT tokens, Itmay come from docker compose env.
var jwtSecret = []byte("nopadox190@altpano.com")

var rateLimiter = ratelimit.NewBucketWithRate(1, 5) // 1 request per second, 5 burst // rate limit func mentioned in the requirements

// actual middleware for rate limiting
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
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			c.Abort()
			return
		}

		// The Authorization header should start with "Bearer "
		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			c.Abort()
			return
		}

		// Remove "Bearer " prefix to get the actual token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse and validate the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method to ensure it's HMAC
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.NewValidationError("unexpected signing method", jwt.ValidationErrorSignatureInvalid)
			}
			return jwtSecret, nil
		})

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Check if token is valid
		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Continue to the next handler if authentication is successful
		c.Next()
	}
}

func connectToProductService() pbProduct.ProductServiceClient {
	conn, err := grpc.Dial("product-service:50051", grpc.WithInsecure())
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
	// r.Use(JWTAuthMiddleware())
	r.Use(RateLimitMiddleware()) // Apply rate limiting middleware globally

	productClient := connectToProductService() // Connect to the Product service
	orderClient := connectToOrderService()

	// Protected route to get a product by ID
	r.GET("/products/:id", func(c *gin.Context) {
		id := c.Param("id") // Get the product ID from the URL
		idInt, err := strconv.Atoi(id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"}) // Return an error if the ID is not a number
			return
		}
		req := &pbProduct.FindOneRequest{Id: int32(idInt)} // Create a FindOneRequest with the product ID
		res, err := productClient.FindOne(c, req)          // Call the FindOne method on the Product service
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()}) // Return an error if the request fails
			return
		}
		c.JSON(200, res) // Return the product as JSON
	})

	// Protected route to create a new order TODO: this is not implemented by me (no proto made)
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
