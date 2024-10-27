import { CartService } from './cart.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, Session } from '@nestjs/common';
import { Cart } from './schema/cart.schema';
import { CreateCartDto } from './dtos/create-cart.dto';
import { ICartService } from './interfaces/cart.interface';
import { UpdateCartDto } from './dtos/update-cart.dto';

@Controller('cart')
export class CartController implements ICartService {
    constructor(private cartService: CartService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getCartItems(@Session() session: Record<string, any>): Promise<Cart>{
        return await this.cartService.getCartItems(session)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createCart(@Session() session: Record<string, any>, @Body() createCartDto: CreateCartDto): Promise<Cart> {
        return await this.cartService.createCart(session, createCartDto)
    }

    @Patch('/remove')
    @HttpCode(HttpStatus.OK)
    async removeItemFromCart(@Session() session: Record<string, any>, @Body() updateCartDto: UpdateCartDto): Promise<Record<string, any>> {
        return await this.cartService.removeItemFromCart(session, updateCartDto)
    }

    @Patch('/clear')
    @HttpCode(HttpStatus.OK)
    async clearCart(@Session() session: Record<string, any>): Promise<Record<string, any>> {
        return await this.cartService.clearCart(session)
    }
}
