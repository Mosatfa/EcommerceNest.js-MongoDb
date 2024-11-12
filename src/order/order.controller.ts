import { Roles } from 'src/common/decorator/roles.decorator';
import { OrderService } from './order.service';
import { Body, Controller, HttpCode, HttpStatus, Param, Post, Query, Req, Session, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';
import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CancleOrderDto } from './dtos/cancle-order.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';
import { UpdateOrderStautsDto } from './dtos/update-order.dto';
import { IOrderService } from './interfaces/order.interface';
import { Cart } from 'src/cart/schema/cart.schema';

@Controller('order')
export class OrderController implements IOrderService {
    constructor(
        private orderService: OrderService
    ) { }


    @Post()
    @Roles(Role.User)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    async createOrder(@Session() session: Record<string, any>, @Req() req: CustomRequest, @Body() createOrderDto: CreateOrderDto): Promise<Order | string> {
        return await this.orderService.createOrder(session, req, createOrderDto)
    }

    @Post(':orderId')
    @Roles(Role.User)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async cancelOrder(@Param('orderId', ParseObjectIdPipe) orderId: string, @Req() req: CustomRequest, @Body() cancleOrderDto: CancleOrderDto): Promise<Record<string, any>> {
        return await this.orderService.cancelOrder(orderId, req, cancleOrderDto)
    }

    @Post('cancelPayment')
    @Roles(Role.User)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async cancelOrderPayment(@Session() session: Record<string, any>, @Query('orderId', new ParseObjectIdPipe) orderId: string, req: CustomRequest): Promise<Cart> {
        return await this.orderService.cancelOrderPayment(session, orderId, req)
    }

    @Post(':orderId/admin')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async updateOrderStatusByAdmin(@Param('orderId', ParseObjectIdPipe) orderId: string, @Req() req: CustomRequest, @Body() updateOrderStautsDto: UpdateOrderStautsDto): Promise<Record<string, any>> {
        return await this.orderService.updateOrderStatusByAdmin(orderId, req, updateOrderStautsDto)
    }
}
