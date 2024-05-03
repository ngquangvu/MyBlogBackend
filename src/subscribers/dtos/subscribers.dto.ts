import { Subscriber } from '@prisma/client'
import { IsBoolean, IsNotEmpty, IsOptional, IsEmail } from 'class-validator'

export class SubscriberDto implements Omit<Subscriber, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsBoolean()
    @IsOptional()
    readonly isActive: boolean

    @IsBoolean()
    @IsOptional()
    readonly isAgree: boolean
}
