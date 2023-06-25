import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UserDTO {
    @IsString()
    @IsNotEmpty()
    readonly firstName: string

    @IsString()
    @IsNotEmpty()
    readonly lastName: string

    // @IsString()
    // @IsNotEmpty()
    // readonly email: string

    @IsDateString({ strict: true })
    createdAt: Date | ''

    @IsOptional()
    @IsDateString({ strict: true })
    updatedAt: Date | ''

    @IsOptional()
    @IsDateString({ strict: true })
    deletedAt: Date | ''
}
