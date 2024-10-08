import { Transform } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPositive, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(200)
    name: string;

    @Transform(({ value }) => Number(value))  // Converts string to number
    @IsNumber()
    @IsPositive()
    @Min(0)
    price: number;

    @Transform(({ value }) => Number(value))  // Converts string to number
    @IsNumber()
    @IsPositive()
    @Min(1)
    stock: number;

    @Transform(({ value }) => Number(value)) 
    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional() // Discount is optional
    discount?: number;

    @IsArray()
    @ArrayMinSize(1)
    @IsOptional()
    size?: string[];

    @IsArray()
    @ArrayMinSize(1)
    @IsOptional()
    colors?: string[];

    @IsMongoId()
    @IsNotEmpty()
    categoryId: string;

    @IsMongoId()
    @IsNotEmpty()
    subcategoryId: string;

    @IsMongoId()
    @IsNotEmpty()
    brandId: string;
}