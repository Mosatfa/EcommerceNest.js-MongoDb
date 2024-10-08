import { IsDateString, IsNotEmpty, IsNumber, IsObject, IsString, Length, Max, Min } from "class-validator";


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 200)
    name: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    amount: number;

    @IsDateString()
    @IsNotEmpty()

    expireDate: Date; 
   
}