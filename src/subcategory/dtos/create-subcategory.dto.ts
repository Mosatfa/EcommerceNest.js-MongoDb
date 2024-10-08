import { IsNotEmpty, IsObject, IsString, Length } from "class-validator";
import { Types } from "mongoose";

export class CreateSubCategoryDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 200)
    name: string;

    @IsObject()
    @IsNotEmpty()
    file: Record<string, any>;
}