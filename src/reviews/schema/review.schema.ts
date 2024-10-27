import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'joi';
import mongoose, { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {

    @Prop({ type: String, required: true })
    comment: string;

    @Prop({ type: Number, required: true, min: 1, max: 2 })
    rating: number;

    @Prop({ type: Date, required: true })
    expireDate: Date;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Order', required: true })
    orderId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Product', required: true })
    productId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
    createdBy: mongoose.Schema.Types.ObjectId;

}

export const ReviewSchema = SchemaFactory.createForClass(Review);