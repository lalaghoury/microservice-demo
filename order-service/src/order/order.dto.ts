import { IsNotEmpty, IsNumber, IsArray, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsNumber()
    customerId: number;

    @IsNotEmpty()
    @IsArray()
    productIds: number[];

    @IsNotEmpty()
    @IsNumber()
    totalPrice: number;
}


export class UpdateOrderDto {
    @IsOptional()
    @IsNumber()
    totalPrice?: number;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsArray()
    productIds?: number[];
}
