import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {

    @Prop({ type: String, required: true })
    cartId_session: string

    @Prop([{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1, required: true }
    }])
    products: Array<{ productId: mongoose.Schema.Types.ObjectId, quantity: number }>;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: false })
    couponId: mongoose.Schema.Types.ObjectId | Types.ObjectId

    @Prop({ type: Number, default: 0, required: true })
    subTotal: number;

    @Prop({ type: Number, default: 0, required: true })
    finalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);