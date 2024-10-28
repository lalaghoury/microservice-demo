// product-service/src/product/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  FindOneRequest,
  FindOneResponse,
  DecreaseQuantityRequest,
  DecreaseQuantityResponse,
  Product as ProductMessage,
} from '../proto/product.pb';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // REST Endpoints

  @Post()
  create(@Body() createProductDto: Partial<ProductMessage>) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<ProductMessage>,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  // gRPC Methods

  @GrpcMethod('ProductService', 'FindOne')
  async findOneGrpc(data: FindOneRequest): Promise<FindOneResponse> {
    const product = await this.productService.findOne(data.id);
    return { product };
  }

  @GrpcMethod('ProductService', 'DecreaseQuantity')
  async decreaseQuantity(
    data: DecreaseQuantityRequest,
  ): Promise<DecreaseQuantityResponse> {
    const success = await this.productService.decreaseQuantity(
      data.id,
      data.quantity,
    );
    return { success };
  }
}
