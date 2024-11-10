import { CustomRequest } from "src/common/interfaces/custom-request.interface";
import { CreateOrderDto } from "../dtos/create-order.dto";
import { Order } from "../schema/order.schema";
import { CancleOrderDto } from "../dtos/cancle-order.dto";
import { UpdateOrderStautsDto } from "../dtos/update-order.dto";


export interface IOrderService {
    createOrder(session: Record<string, any>, req: CustomRequest, createOrderDto: CreateOrderDto): Promise<Order | string>
    cancelOrder(orderId: string, req: CustomRequest, cancleOrderDto: CancleOrderDto): Promise<Record<string, any>>
    updateOrderStatusByAdmin(orderId: string, req: CustomRequest, updateOrderStautsDto: UpdateOrderStautsDto): Promise<Record<string, any>>
}