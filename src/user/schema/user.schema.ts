import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';;
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {

    @Prop({ type: String, required: true })
    userName: string;

    @Prop({ type: String, unique: true, required: true })
    email: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: String })
    phone: string;

    @Prop({ type: String })
    address: string;

    @Prop({ type: String })
    DOB: string

    @Prop({ type: String, default: 'male', enum: ['male', 'female'] })
    gender: String;

    @Prop({ type: String, default: 'User', enum: ['User', 'Admin'] })
    role: String;

    @Prop({ type: Boolean, default: false })
    active: Boolean;

    @Prop({ type: Boolean, default: false })
    isVerified: Boolean;

    @Prop({ type: Boolean, default: false })
    blocked: Boolean;

    @Prop({ type: String, default: 'offline', enum: ['offline', 'online', 'blocked'] })
    status: String;

    @Prop({ type: String, default: 'SYSTEM', enum: ['SYSTEM', 'GOOGLE'] })
    proveder: String;
    
    @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Product' }] })
    wishlist: mongoose.Types.ObjectId[];

    // changePasswordTime: Date,
    // image: String,

}

export const UserSchema = SchemaFactory.createForClass(User);