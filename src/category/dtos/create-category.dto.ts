import { IsNotEmpty, IsObject, IsString, Length } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 200)
    name: string;
}