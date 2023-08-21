import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { LoginDto } from './login.dto'
import { Role } from '@prisma/client'

export class RegisterUserDto extends LoginDto {
    @IsEmail()
    @IsNotEmpty()
    readonly firstName: string

    @IsEmail()
    @IsNotEmpty()
    readonly lastName: string

    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(32)
    @Matches(/^([a-zA-Z0-9@#\$%&?!]+)$/, {
        message: 'Special characters cannot be used for password'
    })
    readonly password: string

    @IsNotEmpty()
    readonly role: Role
}
