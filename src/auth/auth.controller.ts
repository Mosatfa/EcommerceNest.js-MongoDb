import { Request } from 'express';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseFilters } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('singup')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Req() req: Request, @Body() signupDataDto: SignUpDto) {
        return await this.authService.signUp(req , signupDataDto)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Req() req: Request, @Body() loginDataDto: LoginDto) {
        return await this.authService.login(loginDataDto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)  
    async refreshTokens(@Body() refreshTokenDto:RefreshTokenDto) {
        return await this.authService.refreshTokens(refreshTokenDto)
    }
}
