// order-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { join } from 'path';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST ?? 'order-db',
      port: parseInt(process.env.POSTGRES_PORT, 10) ?? 5436,
      username: process.env.POSTGRES_USER ?? 'postgres',
      password: process.env.POSTGRES_PASSWORD ?? '1',
      database: process.env.POSTGRES_DB ?? 'orderdb',
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
export class AppModule {}
