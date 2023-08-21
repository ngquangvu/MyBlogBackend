import { User } from '@prisma/client'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LoginDto implements Pick<User, 'email' | 'password'> {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    readonly password: string
}
