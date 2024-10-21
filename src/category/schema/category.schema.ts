import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true, unique: true, uppercase: true })
    name: string;

    @Prop({ required: true, lowercase: true })
    slug: string;

    @Prop({ required: true, type: Object }) //cloudenary
    image: Record<string, any>;;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    createdBy: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    updatedBy: mongoose.Schema.Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);