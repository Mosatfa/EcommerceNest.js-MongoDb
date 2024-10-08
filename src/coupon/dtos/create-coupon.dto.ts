import { IsDateString, IsNotEmpty, IsNumber, IsObject, IsString, Length, Max, Min } from "class-validator";
import { IsFutureDate } from "../validators/is-future-date.validator";


export class CreateCouponDto {
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
    @IsFutureDate({ message: 'Expire date must be in the future' })
    expireDate: Date; 
   
}