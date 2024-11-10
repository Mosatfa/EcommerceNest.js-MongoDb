import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

// Define the ProductItem as a nested schema within Cart


@Schema({ timestamps: true })
export class Order {

    @Prop({ type: String, required: true })
    address: string
    @Prop([{ type: String, required: true }])
    phone: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: mongoose.Schema.Types.ObjectId | Types.ObjectId

    @Prop([{ type: String, required: false }])
    note: string

    @Prop([{
        name: { type: String, required: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1, required: true },
        unitPrice: { type: Number, default: 1, required: true },
        finalPrice: { type: Number, default: 1, required: true }
    }])
    products: Array<{ productId: mongoose.Schema.Types.ObjectId, quantity: number, unitPrice: number, finalPrice: number }>;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: false })
    couponId: mongoose.Schema.Types.ObjectId | Types.ObjectId

    @Prop({ type: Number, default: 0, required: true })
    subTotal: number;

    @Prop({ type: Number, default: 0, required: true })
    finalPrice: number;

    @Prop({ type: String, default: 'cash', enum: ['cash', 'card'] })
    paymentType: String;

    @Prop({ type: String, default: 'placed', enum: ['placed', 'waitPayment', 'canceled', 'rejected', 'onWay', 'delivered'] })
    status: String;

    @Prop([{ type: String, required: false }])
    reason: String

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
    updatedBy: mongoose.Schema.Types.ObjectId


}

export const OrderSchema = SchemaFactory.createForClass(Order);