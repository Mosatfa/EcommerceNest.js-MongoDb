
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";


export enum PaymentType {
    CASH = 'cash',
    CARD = 'card',
    ONLINE = 'online',
}

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    @Length(5, 255)
    address: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?:\+20|0)?1[0125]\d{8}$/, {
        message: 'Phone number must start with +20 or 0, followed by a valid 10-digit Egyptian number.',
    })
    phone: string;

    @IsString()
    @IsOptional()
    note?: string;

    @IsEnum(PaymentType, {
        message: 'Payment type must be one of the following: cash, card, online',
    })
    paymentType: PaymentType;
}