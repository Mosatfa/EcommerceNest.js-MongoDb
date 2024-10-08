import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './jwt/Generate&VerifyToken.service';
import { MailService } from 'src/mail/mail.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, JwtService, TokenService ,MailService]
})
export class AuthModule { }
