import { IsNotEmpty, IsString } from "class-validator";

export class ApplyCouponDto {
    @IsString()
    @IsNotEmpty()
    couponName: string;
}