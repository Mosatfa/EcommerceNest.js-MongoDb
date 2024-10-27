import { IsInt, IsMongoId, IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import mongoose from "mongoose";


export class CreateCartDto {
    @IsMongoId()
    @IsNotEmpty()
    productId:mongoose.Schema.Types.ObjectId;

    @IsNumber()
    @IsPositive()
    @IsInt()
    @IsNotEmpty()
    quantity:number;
}