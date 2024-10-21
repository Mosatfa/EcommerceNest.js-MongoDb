import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
    @Prop({ required: true, unique: true, lowercase: true })
    name: string;

    @Prop({ required: true, type: Object }) //cloudenary
    logo: Record<string, any>;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    createdBy: mongoose.Schema.Types.ObjectId; 

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    updatedBy: mongoose.Schema.Types.ObjectId;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);