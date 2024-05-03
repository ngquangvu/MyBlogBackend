import { Subscriber } from '@prisma/client'
import { IsBoolean, IsNotEmpty, IsOptional, IsEmail } from 'class-validator'

export class SubscriberUserDto
    implements Omit<Subscriber, 'id' | 'isActive' | 'isAgree' | 'createdAt' | 'updatedAt' | 'deletedAt'>
{
    @IsEmail()
    @IsNotEmpty()
    readonly email: string
}
