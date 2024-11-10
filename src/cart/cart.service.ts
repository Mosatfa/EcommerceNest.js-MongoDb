import { session } from 'express-session';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dtos/create-cart.dto';
import { Cart } from './schema/cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Schema, Types } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';
import { UpdateCartDto } from './dtos/update-cart.dto';
import { ICartService } from './interfaces/cart.interface';

@Injectable()
export class CartService implements ICartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<Cart>,
        @InjectModel(Product.name) private productModel: Model<Product>,
    ) { }

    async getCartItems(session: Record<string, any>): Promise<Cart> {
        return this.cartModel.findOne({ cartId_session: session.cartId });
    }

    async createCart(session: Record<string, any>, createCartDto: CreateCartDto): Promise<Cart> {
        const { productId, quantity } = createCartDto;

        // Check Product Available
        const product = await this.productModel.findById(productId)
        if (!product) {
            throw new BadRequestException('In-Valid Product Id')
        }

        if (product.stock < quantity || product.isDeleted) {
            throw new BadRequestException(`In-Valid Product quantity max available is ${product.stock}`)
        }

        const subTotal = parseFloat((product.finalPrice * quantity).toFixed(2)) // Calc subtotal
        // Check Cart Exist
        const cart = await this.cartModel.findOne({ cartId_session: session.cartId })
        // If not exist create new cart
        if (!cart) {
            const newCart = await this.cartModel.create(
                {
                    cartId_session: session.cartId, products: [{ productId, quantity }],
                    subTotal: subTotal,
                    finalPrice: subTotal
                }
            )
            return newCart
        }

        // If Exist
        // 1 - Update Old Item
        // let matchProduct = false;
        // for (let i = 0; i < cart.products.length; i++) {
        //     if (cart.products[i].productId == productId) {
        //         cart.products[i].quantity = quantity
        //         matchProduct = true
        //         break;
        //     }
        // }
        // // 2- Add New Product
        // if (!matchProduct) {
        //     cart.products.push({ productId, quantity })
        // }
        // await cart.save()
        const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId.toString());

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity = quantity;
            cart.subTotal = subTotal
            cart.finalPrice = subTotal
        } else {
            cart.products.push({ productId, quantity });
            cart.subTotal += subTotal
            cart.finalPrice += subTotal
        }

        await cart.save()
        return cart
    }


    async removeItemFromCart(session: Record<string, any>, updateCartDto: UpdateCartDto): Promise<Record<string, any>> {
        const updatedCart = await this.removeItem(updateCartDto.productId, session.cartId)

        if (!updatedCart.modifiedCount) {
            throw new NotFoundException('Product not found in cart.');
        }

        return { message: 'Item has been removed' };
    }

    async clearCart(session: Record<string, any>): Promise<Record<string, any>> {
        const clearedCart = await this.emptyCart(session.cartId)
        if (!clearedCart.modifiedCount) {
            throw new NotFoundException('Cart already empty.');
        }
        return { message: "The shopping cart has been emptied" }
    }


    async removeItem(productId: mongoose.Schema.Types.ObjectId, cartId: string): Promise<Record<string, any>> {
        console.log(productId, cartId);

        const result = await this.cartModel.updateOne({ cartId_session: cartId },
            {
                $pull: {
                    products: { productId }
                }
            })
        return result
    }

    async emptyCart(cartId: string): Promise<Record<string, any>> {
        const result = await this.cartModel.updateOne(
            { cartId_session: cartId },
            { $set: { products: [] } },
        );
        return result;
    }
}
