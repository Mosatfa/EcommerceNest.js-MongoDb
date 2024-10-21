import { LoginDto } from "../dto/login.dto"
import { RefreshTokenDto } from "../dto/refresh-token.dto"
import { SignUpDto } from "../dto/signup.dto"
import { SignupResponse } from "./signup-response.interface";
import { TokenResponse } from "./token-response.interface";

export interface IAuthService {

    signUp(req: Request, signupDataDto: SignUpDto): Promise<SignupResponse>;

    login(loginDataDto: LoginDto): Promise<TokenResponse>;

    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<TokenResponse>;
}
