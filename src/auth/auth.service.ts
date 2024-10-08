import { ConfigService } from '@nestjs/config';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';;
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { TokenService } from './jwt/Generate&VerifyToken.service';
import { Request } from 'express';
import { BcryptService } from './bcrypt/bcrypt.service';
import { MailService } from 'src/mail/mail.service';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private configService: ConfigService,
        private tokenService: TokenService,
        private bcryptService: BcryptService,
        private mailService: MailService

    ) { }



    async signUp(req: Request, signupData: any) {
        const { userName, email, password } = signupData;
        console.log(userName, email, password);

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
        console.log(link);

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
        console.log(password);

        const hashPassword = this.bcryptService.hash(password)

        const { _id } = await this.userModel.create({ userName, email, password: hashPassword })
        return { id_: _id }
    }

    async login(req: Request, loginData: LoginDto) {
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
        const refresh_token = this.tokenService.generateToken({ payload: { id: user._id, role: user.role }, expiresIn: 60 * 60 * 24 * 365 })

        user.status = "Online"
        user.save()

        return { message: "Done",access_token, refresh_token }
    }

}













