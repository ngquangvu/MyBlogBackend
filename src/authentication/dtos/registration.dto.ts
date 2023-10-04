import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { LoginDto } from './login.dto'
import { Role } from '@prisma/client'

export class RegisterUserDto extends LoginDto {
    @IsString()
    @IsNotEmpty()
    readonly firstName: string

    @IsString()
    @IsNotEmpty()
    readonly lastName: string

    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(32)
    @Matches(/^([a-zA-Z0-9@#\$%&?!]+)$/, {
        message: 'Special characters cannot be used for password'
    })
    readonly password: string

    @IsNotEmpty()
    readonly role: Role
}
