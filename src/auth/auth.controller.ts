import { Request } from 'express';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseFilters } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('singup')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Req() req: Request, @Body() signupData: SignUpDto) {
        return await this.authService.signUp(req , signupData)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)  // Sets the HTTP status to 200 for successful login
    async login(@Req() req: Request, @Body() loginData: LoginDto) {
        return await this.authService.login(req, loginData);
    }
}
