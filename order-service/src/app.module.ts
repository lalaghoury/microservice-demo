// order-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1',
      database: 'orderdb',
      entities: [Order],
      synchronize: true,
    }),
    OrderModule,
    // ClientsModule.register([
    //   {
    //     name: 'PRODUCT_PACKAGE',
    //     transport: Transport.GRPC,
    //     options: {
    //       package: 'product',
    //       protoPath: join(__dirname, './proto/product.proto'),
    //       url: 'localhost:50051',
    //     },
    //   },
    // ]),
  ],
})
export class AppModule { }
