import { Request } from 'express';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseFilters } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignupResponse } from './interface/signup-response.interface';
import { TokenResponse } from './interface/token-response.interface';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Req() req: Request, @Body() signupDataDto: SignUpDto): Promise<SignupResponse> {
        return await this.authService.signUp(req, signupDataDto)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDataDto: LoginDto): Promise<TokenResponse> {
        return await this.authService.login(loginDataDto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenResponse> {
        return await this.authService.refreshTokens(refreshTokenDto)
    }
}
