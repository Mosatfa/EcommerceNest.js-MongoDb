import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SubcategoryDocument = HydratedDocument<Subcategory>;

@Schema({ timestamps: true })
export class Subcategory {
    @Prop({ required: true, unique: true })
    customId: string

    @Prop({ required: true, unique: true, lowercase: true })
    name: string;

    @Prop({ required: true, lowercase: true })
    slug: string;

    @Prop({ required: true, type: Object }) //cloudenary
    image: Record<string, any>;;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true })
    categoryId: mongoose.Schema.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
    createdBy: mongoose.Schema.Types.ObjectId; // required: true type USER

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    updatedBy: mongoose.Schema.Types.ObjectId;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);

