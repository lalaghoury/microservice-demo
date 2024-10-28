import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json')
    products: { productId: number; quantity: number }[];

    @Column('decimal')
    total: number;
}
