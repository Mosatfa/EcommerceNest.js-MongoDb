import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
    constructor(private jwtService: JwtService, private configService: ConfigService) { }

    generateToken({
        payload = {},
        signature = this.configService.get<string>('JWT_SECRET'),
        expiresIn = 60 * 60,
    }: {
        payload?: Record<string, any>;
        signature?: string;
        expiresIn?: number | string;
    } = {}): string {
        const token = this.jwtService.sign(payload, {
            secret: signature,
            expiresIn,
        });
        return token;
    }


    verifyToken({
        token,
        signature = process.env.TOKEN_SIGNATURE,
    }: {
        token: string;
        signature?: string;
    }): any {
        const decoded = this.jwtService.verify(token, {
            secret: signature,
        } as JwtVerifyOptions);
        return decoded;
    }

}
