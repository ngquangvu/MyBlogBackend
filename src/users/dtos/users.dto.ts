import { Role, User } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

export class UserDto implements Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'password'> {
    @IsString()
    @IsNotEmpty()
    readonly firstName: string

    @IsString()
    @IsNotEmpty()
    readonly lastName: string

    @IsString()
    @IsNotEmpty()
    readonly email: string

    @IsNotEmpty()
    role: Role
}
