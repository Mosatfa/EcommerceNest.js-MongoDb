import { IsNotEmpty, IsObject, IsString, Length } from "class-validator";


export class CreateBrandDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 200)
    name: string;
}