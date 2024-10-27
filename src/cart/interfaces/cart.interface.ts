import { CustomRequest } from "src/common/interfaces/custom-request.interface";
import { CreateCartDto } from "../dtos/create-cart.dto";
import { UpdateCartDto } from "../dtos/update-cart.dto";

import { Cart } from "../schema/cart.schema";


export interface ICartService {
    getCartItems(session: Record<string, any>): Promise<Cart>;
    createCart(session: Record<string, any>, createCartDto: CreateCartDto): Promise<Cart>;
    removeItemFromCart(session: Record<string, any>, updateCartDto: UpdateCartDto): Promise<Record<string, any>>;
    clearCart(session: Record<string, any>): Promise<Record<string, any>>;
}