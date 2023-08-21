import { User } from '@prisma/client'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class UserDto implements Pick<User, 'email'> {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string
}
