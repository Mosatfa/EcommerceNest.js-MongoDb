import { Request } from 'express';
import mongoose from 'mongoose';

export interface CustomRequest extends Request {
    user: {
        _id:  mongoose.Schema.Types.ObjectId;
        userName: string,
        role:string
    };
}