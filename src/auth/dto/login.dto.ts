import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";


export class LoginDto {
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsString()
    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        { message: 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.' }
    )
    password: string;
}