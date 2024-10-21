import { ConfigService } from '@nestjs/config';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';;
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { TokenService } from './service/generate&VerifyToken.service';
import { Request } from 'express';
import { BcryptService } from './bcrypt/bcrypt.service';
import { MailService } from 'src/mail/mail.service';
import { LoginDto } from './dto/login.dto';
import { RefreshToken } from 'src/auth/schema/refresh-token.schema';
import { RefreshTokenService } from './service/refresh-token.service';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenResponse } from './interface/token-response.interface';
import { SignupResponse } from './interface/signup-response.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
        private configService: ConfigService,
        private tokenService: TokenService,
        private bcryptService: BcryptService,
        private mailService: MailService,
        private refreshTokenService: RefreshTokenService
    ) { }


    async signUp(req: Request, signupData: any): Promise<SignupResponse> {
        const { userName, email, password } = signupData;

        if (await this.userModel.findOne({ email: email.toLowerCase() })) {
            throw new ConflictException('Email already Exist')
        };

        const token = this.tokenService.generateToken({
            payload: { email },
            signature: this.configService.get<string>('JWT_SECRET_Email'),
            expiresIn: 5 * 60, // This sets the expiration to 5 minutes
        });

        const refreshToken = this.tokenService.generateToken({
            payload: { email },
            signature: this.configService.get<string>('JWT_SECRET_Email'),
            expiresIn: 60 * 60 * 24, // This sets the expiration to 24 hours
        });


        const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
        const rfLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}`
 

        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Document</title>
            <style>
                .text-center{
                    text-align: center;
                }
                a {
                    color: white;
                    text-decoration: none;
                }
                button {
                    background-color: #4CAF50; /* Green */
                    border: none;
                    color: white;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <h1>Click To Confirm Email:</h1>
            <div class="text-center">
                <div>
                    <button><a href="${link}">Verify Email Address</a></button>
                </div>
                <br>
                <div>
                    <button><a href="${rfLink}">Requset New Email</a></button>
                </div>
            </div>
        </body>
        </html>`


        if (!await this.mailService.sendMail({ to: email, subject: 'Confirm Email', html })) {
            throw new BadRequestException(`Email Rejected`)
        }

        const hashPassword = this.bcryptService.hash(password)

        const { _id } = await this.userModel.create({ userName, email, password: hashPassword })
        return { _id: _id }
    }

    async login(loginData: LoginDto): Promise<TokenResponse> {
        const { email, password } = loginData;

        const user = await this.userModel.findOne({ email: email.toLowerCase() })
        if (!user) {
            throw new BadRequestException(`Not Register Account`)
        };

        if (!user.isVerified) {
            throw new BadRequestException(`please confrim your email frist`)
        };

        if (!this.bcryptService.compare(password, user.password)) {
            throw new ConflictException(`In-Valid login data`)
        }

        const access_token = this.tokenService.generateToken({ payload: { id: user._id, role: user.role }, expiresIn: 60 * 30 })
        const refresh_token = uuidv4()

        await this.refreshTokenService.storeRefreshToken(refresh_token, user._id);

        user.status = "online"
        await user.save()

        return { access_token, refresh_token }
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<TokenResponse> {
        const token = await this.refreshTokenModel.findOne({
            token: refreshTokenDto.refreshtoken,
            expireDate: { $gte: new Date() }
        })
        if (!token) {
            throw new ConflictException('Refresh token is invalid or has expired')
        }
        
        const user = await this.userModel.findById(token.userId)
        if (!user) {
            throw new ConflictException('User associated with this token does not exist')
        }

        const access_token = this.tokenService.generateToken({ payload: { id: user._id, role: user.role }, expiresIn: 60 * 30 })
        const refresh_token = uuidv4()

        // Update the refresh token in the database
        token.token = refresh_token;
        token.expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expiry set to 7 days
        await token.save();

        // Return the new token
        return {
            access_token,
            refresh_token
        };
    }

}













