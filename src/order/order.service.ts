import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Cart } from 'src/cart/schema/cart.schema';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';
import { Model } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { Coupon } from 'src/coupon/schema/coupon.schema';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CancleOrderDto } from './dtos/cancle-order.dto';
import { UpdateOrderStautsDto } from './dtos/update-order.dto';
import { IOrderService } from './interfaces/order.interface';

@Injectable()
export class OrderService implements IOrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
        @InjectModel(Cart.name) private cartModel: Model<Cart>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    ) { }

    async createOrder(session: Record<string, any>, req: CustomRequest, createOrderDto: CreateOrderDto): Promise<Order> {
        const { address, phone, note, paymentType } = createOrderDto;

        const cart = await this.cartModel.findOne({ cartId_session: session.cartId })
        if (!cart?.products?.length) {
            throw new BadRequestException('Empty cart');
        }


        req.body.products = cart.products

        // console.log(req.body.products);


        const productIds = []
        const finalProductList = []
        let subTotal = 0;
        for (let { productId, quantity } of req.body.products) {

            const checkProduct = await this.productModel.findOne({
                _id: productId,
                stock: { $gte: quantity },
                isDeleted: false
            })

            if (!checkProduct) {
                throw new BadRequestException('Invalid product or insufficient stock');
            }
            // Prepare the product object for order
            const productData = {
                productId,
                name: checkProduct.name,
                unitPrice: checkProduct.finalPrice,
                quantity,
                finalPrice: parseFloat((checkProduct.finalPrice * quantity).toFixed(2)),
            };

            productIds.push(productId);
            finalProductList.push(productData);
            subTotal += productData.finalPrice;
        }


        //Create Order
        const order = await this.orderModel.create({
            userId: req.user._id,
            address,
            phone,
            note,
            products: finalProductList,
            couponId: cart?.couponId,
            subTotal,
            finalPrice: cart.finalPrice,
            paymentType,
            status: paymentType ? "placed" : "waitPayment",
        })

        for (const product of req.body.products) { await this.productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } }) }

        // push userId in usedbY COUPON
        if (cart?.couponId) {
            await this.couponModel.updateOne({ _id: cart.couponId }, { $addToSet: { usedBy: req.user._id } })
        }

        // clear item cart
        await this.cartModel.updateOne(
            { cartId_session: session.cartId }, // user id 
            { $set: { products: [] } },
        );

        return order
    }

    async cancelOrder(orderId: string, req: CustomRequest, cancleOrderDto: CancleOrderDto): Promise<Record<string, any>> {
        const { reason } = cancleOrderDto;

        const order = await this.orderModel.findOne({ _id: orderId, userId: req.user._id })
        if (!order) {
            throw new NotFoundException(`Invalid Order ID`);
        }
        if ((order.status != "placed" && order.paymentType == "cash") || (order.status != "waitPayment" && order.paymentType == "card")) {
            throw new BadRequestException(
                `Cannot cancel your order after it has been changed to ${order.status}`
            );
        }

        // Update the order status to 'canceled'
        const cancelOrder = await this.orderModel.updateOne(
            { _id: order._id },
            { status: 'canceled', reason, updatedBy: req.user._id }
        );

        if (!cancelOrder.matchedCount) {
            throw new BadRequestException(`Failed to cancel your order`);
        }


        // Revert product stock for each product in the order
        for (const product of order.products) {
            await this.productModel.updateOne(
                { _id: product.productId },
                { $inc: { stock: product.quantity } }
            );
        }

        // Remove the user from the coupon usage history if a coupon was applied
        if (order.couponId) {
            await this.couponModel.updateOne(
                { _id: order.couponId },
                { $pull: { usedBy: req.user._id } }
            );
        }


        return { message: "Order canceled successfully" };
    }

    async updateOrderStatusByAdmin(orderId: string, req: CustomRequest, updateOrderStautsDto: UpdateOrderStautsDto): Promise<Record<string, any>>  {
        const { status } = updateOrderStautsDto;

        const order = await this.orderModel.findOne({ _id: orderId, userId: req.user._id })
        if (!order) {
            throw new NotFoundException(`Invalid Order ID`);
        }


        const orderStatus = await this.orderModel.updateOne({ _id: order._id }, { status, updatedBy: req.user._id })

        if (!orderStatus.matchedCount) {
            throw new BadRequestException(`Failed to change the order status`);
        }

        return { message: "Order status updated successfully" };
    }
}
