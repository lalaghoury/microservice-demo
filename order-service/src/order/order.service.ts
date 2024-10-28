// order-service/src/order/order.service.ts
import { Injectable, Inject, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, catchError, forkJoin, from, map, mergeMap } from 'rxjs';
import {
    FindOneResponse,
    DecreaseQuantityResponse,
    Product,
    ProductService,
} from '../proto/product.pb';

@Injectable()
export class OrderService implements OnModuleInit {
    private productService: ProductService;

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @Inject('PRODUCT_PACKAGE') private client: ClientGrpc,
    ) { }

    onModuleInit() {
        this.productService = this.client.getService<ProductService>('ProductService');
    }

    async placeOrder(orderData: {
        products: { productId: number; quantity: number }[];
    }): Promise<Order> {
        let total = 0;

        const productObservables = orderData.products.map((item) => {
            return from(this.productService.FindOne({ id: item.productId })).pipe(
                mergeMap((response) => {
                    if (!response.product) {
                        throw new Error(`Product with ID ${item.productId} not found`);
                    }
                    console.log("product", response.product);

                    // Verify available quantity
                    if (response.product.availableQuantity < item.quantity) {
                        throw new HttpException(
                            `Insufficient quantity for product ID ${item.productId}`, HttpStatus.BAD_REQUEST
                        );
                    }

                    // Decrease product quantity by chaining another observable
                    return from(this.productService.DecreaseQuantity({
                        id: item.productId,
                        quantity: item.quantity,
                    })).pipe(
                        map((decreaseResponse) => {
                            if (!decreaseResponse.success) {
                                throw new Error(
                                    `Failed to decrease quantity for product ID ${item.productId}`
                                );
                            }

                            // Calculate the total price for the order
                            total += response.product.price * item.quantity;

                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                            };
                        })
                    );
                }),
                catchError((error) => {
                    console.error(`Failed to process product with ID ${item.productId}: ${error.message}`);
                    throw error; // Re-throw to propagate the error
                })
            );
        });

        // Use forkJoin to wait for all product observables to complete
        try {
            const products = await forkJoin(productObservables).toPromise();

            // Create and save the order once all product checks are complete
            const order = this.orderRepository.create({
                products,
                total,
            });

            return this.orderRepository.save(order);
        } catch (error) {
            console.error('Error placing order:', error.message);
            throw error;
        }
    }

    findAll(): Promise<Order[]> {
        return this.orderRepository.find();
    }
}
