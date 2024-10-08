import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'joi';
import mongoose, { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {

    @Prop({ type: String, required: true, unique: true, uppercase: true })
    name: string;

    @Prop({ type: Number, default: 1 })
    amount: number;

    @Prop({ type: Date, required: true })
    expireDate: Date;

    @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
    usedBy: mongoose.Types.ObjectId[];

    @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: false }) // ture
    createdBy: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
    updatedBy: mongoose.Types.ObjectId;

}

export const CouponSchema = SchemaFactory.createForClass(Coupon);