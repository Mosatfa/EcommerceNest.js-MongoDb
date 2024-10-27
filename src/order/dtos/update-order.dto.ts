import { IsEnum } from "class-validator";


export enum StatusType {
    PLACED = 'placed',
    WAIT = 'waitPayment',
    CANCELED = 'canceled',
    REJECTED = 'rejected',
    ON_WAY = 'onWay',
    DELIVERED = 'delivered',
}
export class UpdateOrderStautsDto {
    @IsEnum(StatusType, {
        message: 'Order status must be one of the following: placed, waitPayment, canceled, rejected, onWay, delivered',
    })
    status: StatusType;
}