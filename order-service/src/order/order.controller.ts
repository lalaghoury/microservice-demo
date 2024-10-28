// order-service/src/order/order.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    async placeOrder(
        @Body() body: { products: { productId: number; quantity: number }[] },
    ) {
        return this.orderService.placeOrder(body);
    }

    @Get()
    async findAll() {
        return this.orderService.findAll();
    }
}
