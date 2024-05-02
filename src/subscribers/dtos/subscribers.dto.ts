import { Subscriber } from '@prisma/client'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SubscriberDto implements Omit<Subscriber, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    @IsString()
    @IsNotEmpty()
    readonly email: string

    @IsBoolean()
    @IsOptional()
    readonly isActive: boolean

    @IsBoolean()
    @IsOptional()
    readonly isAgree: boolean
}
