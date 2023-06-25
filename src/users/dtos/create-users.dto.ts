import { Role, User } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDTO implements Omit<User, 'id'> {
    email: string
    role: Role
    password: string

    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}
