import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';;
import mongoose, { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({ timestamps: true })
export class RefreshToken {

    @Prop({ type: String, required: true })
    token: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: Date, required: true })
    expireDate: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);