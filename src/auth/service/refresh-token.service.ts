import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from '../schema/refresh-token.schema';
import { Model, Types } from 'mongoose';


@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
    ) {}

    async storeRefreshToken(token: string, userId: Types.ObjectId): Promise<void> {
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7); // Set expiration to 7 days from now

        await this.refreshTokenModel.create({
            token,
            userId,
            expireDate: expireDate,
        });
    }
}
