import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {

    @Prop({ type: String, required: true, unique: true })
    customId: string;

    @Prop({ type: String, required: true, trim: true, lowercase: true })
    name: string;

    @Prop({ type: String, required: true, trim: true, lowercase: true })
    slug: string;

    @Prop({ type: String, required: false })
    description: string;

    @Prop({ type: Number, default: 1 })
    stock: number;

    @Prop({ type: Number, default: 1 })
    price: string;

    @Prop({ type: Number, default: 0 })
    discount: number;

    @Prop({ type: Number, default: 1 })
    finalPrice: number;

    @Prop({ type: [String] }) // Array of strings for colors
    colors: string[];

    @Prop({ type: [String], enum: ['s', 'm', 'lg', 'xl'] }) // Array of strings with an enum for sizes
    size: string[]

    @Prop({ type: Object, required: true }) // main image object
    mainImage: Record<string, any>;

    @Prop({ type: [Object] }) // array of sub images
    subImages: Record<string, any>[];

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Category', required: true }) // category reference
    categoryId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Subcategory', required: true }) // subcategory reference
    subcategoryId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Brand', required: true }) // brand reference
    brandId: mongoose.Types.ObjectId;

    @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] }) // wish list of users who wish for this product
    wishUserList: mongoose.Types.ObjectId[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
    createdBy: mongoose.Schema.Types.ObjectId; // required: true type USER

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    updatedBy: mongoose.Schema.Types.ObjectId;

    @Prop({ type: Boolean, default: false }) // soft delete flag
    isDeleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);