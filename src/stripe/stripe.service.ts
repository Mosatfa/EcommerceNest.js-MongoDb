import { CustomRequest } from './../common/interfaces/custom-request.interface';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Coupon } from 'src/coupon/schema/coupon.schema';
import { Order } from 'src/order/schema/order.schema';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(
        private configService: ConfigService,
        @InjectModel(Order.name) private orderModel: Model<Order>,
    ) {
        this.stripe = new Stripe(this.configService.get<string>('SECRET_kEY'), {
            apiVersion: '2024-09-30.acacia'
        })
    }

    async createPaymentSession({
        payment_method_types = ['card'],
        customer_email,
        metadata,
        line_items,
        mode = 'payment',
        discounts = [],
        success_url = `${this.configService.get<string>('SUCCESS_URL')}`,
        cancel_url = `${this.configService.get<string>('CANCEL_URL')}`,
    }: {
        payment_method_types?: Stripe.Checkout.SessionCreateParams.PaymentMethodType[];
        customer_email: string;
        metadata: Record<string, any>;
        line_items: Array<{ productId: Schema.Types.ObjectId; quantity: number; unitPrice: number; finalPrice: number; name?: string }>;
        mode?: Stripe.Checkout.SessionCreateParams.Mode;
        discounts?: Stripe.Checkout.SessionCreateParams.Discount[];
        success_url?: string;
        cancel_url?: string;
    }) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types,
            customer_email,
            metadata,
            line_items: line_items.map(product => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.unitPrice * 100,  // Stripe requires amounts in cents
                },
                quantity: product.quantity,
            })),
            mode,
            discounts,
            success_url,
            cancel_url,

        });

        return session;
    }

    async createCoupon(coupon: Coupon) {
        const createCoupon = await this.stripe.coupons.create(
            {
                percent_off: coupon.amount,
                duration: 'once'
            }
        )
        return createCoupon.id
    }

    async constructEvent(payload: Buffer, signature: string) {
        return this.stripe.webhooks.constructEvent(payload, signature, this.configService.get<string>('WEBHOOK_SECRET'));
    }

    async handlePaymentSuccess(paymentIntent: any) {
        const orderId = paymentIntent.metadata.orderId; // Ensure you add orderId as metadata when creating PaymentIntent
        const order = await this.orderModel.findById(orderId);

        if (order) {
            order.status = 'placed'; // Update the status
            await order.save(); // Save the changes to the database
        }
    }

    async handlePaymentRejected(paymentIntent: any) {
        const orderId = paymentIntent.metadata.orderId; // Ensure you add orderId as metadata when creating PaymentIntent
        const order = await this.orderModel.findById(orderId);
        if (order) {
            order.status = 'rejected'; // Update the status
            await order.save(); // Save the changes to the database
        }
    }

    // async checkOut(req: CustomRequest, res: any, orderId: string): Promise<any> {
    //     const order = await this.orderModel.findOne({ _id: orderId, userId: req.user._id });

    //     if (!order || order.status !== 'waitPayment') {
    //         throw new NotFoundException('Order is invalid or does not exist');
    //     }


    //     if (order.paymentType !== 'card') {
    //         throw new BadRequestException('Invalid payment method');
    //     }

    //     // return this.stripe.paymentIntents.create({
    //     //     amount: order.finalPrice * 100,
    //     //     currency: "usd", // Set currency to USD
    //     //     payment_method_types: ['card'],
    //     // });

    //     const session = await this.stripe.checkout.sessions.create({
    //         payment_method_types: ['card'],
    //         line_items: [{
    //             price_data: {
    //                 currency: 'usd',
    //                 product_data: {
    //                     name: 'Order Payment',
    //                 },
    //                 unit_amount: order.finalPrice * 100,
    //             },
    //             quantity: 1,
    //         }],
    //         mode: 'payment',
    //         success_url: `${this.configService.get<string>('BASE_URL')}stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    //         cancel_url: `${this.configService.get<string>('BASE_URL')}stripe/cancel`,
    //     });

    //     return res.redirect(session.url)
    // }
}
