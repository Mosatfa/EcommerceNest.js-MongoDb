import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";


export class SignUpDto {

    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    @MaxLength(20, { message: 'Username can be at most 20 characters long' })
    userName: string;

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