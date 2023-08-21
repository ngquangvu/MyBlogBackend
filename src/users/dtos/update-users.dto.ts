import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { User } from '@prisma/client'
import { IsEqualTo } from 'src/common/core/interceptors'

export class UpdateUserDto implements Pick<User, 'password' | 'firstName' | 'lastName'> {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(32)
    @Matches(/^([a-zA-Z0-9@#\$%&?!]+)$/, {
        message: 'Special characters cannot be used for password'
    })
    password: string

    @IsOptional()
    @IsString()
    readonly firstName: string | undefined

    @IsOptional()
    @IsString()
    readonly lastName: string | undefined

    @IsOptional()
    @IsString()
    @MinLength(6)
    @IsEqualTo<UpdateUserDto>('password')
    confirmPassword: string
}
