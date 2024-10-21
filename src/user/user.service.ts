import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async findById(id: string): Promise<User> {
        const user = await this.userModel.findById(id).select("userName image role");
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
}
