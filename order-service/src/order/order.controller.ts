// order-service/src/order/order.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod('OrderService', 'PlaceOrder')
  async placeOrderGrpc(
    @Body() body: { products: { productId: number; quantity: number }[] },
  ) {
    return this.orderService.placeOrder(body);
  }

  @GrpcMethod('OrderService', 'GetOrders')
  async getOrders() {
    return this.orderService.findAll();
  }
}
