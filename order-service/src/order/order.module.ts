// order-service/src/order/order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        ClientsModule.register([
            {
                name: 'PRODUCT_PACKAGE',
                transport: Transport.GRPC,
                options: {
                    package: 'product',
                    protoPath: join(__dirname, './proto/product.proto'),
                    url: 'localhost:50051',
                },
            },
        ]),
    ],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule { }
