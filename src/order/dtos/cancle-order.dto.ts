
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";

export class CancleOrderDto {
    @IsString()
    @IsOptional()
    reason?: string;
}