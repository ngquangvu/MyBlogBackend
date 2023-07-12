import { Role } from '@prisma/client'
import { UserDto } from './users.dto'
import { IsString, IsNotEmpty } from 'class-validator'

export class UpdateUserDto implements Omit<UserDto, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'password'> {
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
