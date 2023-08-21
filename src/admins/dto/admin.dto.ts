import { Admin } from '@prisma/client'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class AdminDto implements Pick<Admin, 'email'> {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string
}
