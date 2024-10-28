// product-service/src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    // Create a new product
    create(product: Partial<Product>): Promise<Product> {
        const newProduct = this.productRepository.create(product);
        return this.productRepository.save(newProduct);
    }

    // Retrieve all products
    findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    // Retrieve a single product by ID
    findOne(id: number): Promise<Product> {
        return this.productRepository.findOne({ where: { id } });
    }

    // Update a product
    async update(id: number, updateData: Partial<Product>): Promise<Product> {
        await this.productRepository.update(id, updateData);
        return this.findOne(id);
    }

    // Delete a product
    async remove(id: number): Promise<void> {
        await this.productRepository.delete(id);
    }

    // Decrease product quantity
    async decreaseQuantity(id: number, quantity: number): Promise<boolean> {
        const product = await this.findOne(id);
        if (product && product.availableQuantity >= quantity) {
            product.availableQuantity -= quantity;
            await this.productRepository.save(product);
            return true;
        }
        return false;
    }
}
