import { IsEqualTo } from 'src/common/core/interceptors'
import { CreateAdminDto } from './create-admin.dto'
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class UpdateAdminDto extends CreateAdminDto {
    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(32)
    @Matches(/^([a-zA-Z0-9@#\$%&?!]+)$/, {
        message: 'Special characters can be used for password'
    })
    newPassword: string

    @IsOptional()
    @IsString()
    @MinLength(6)
    @IsEqualTo<UpdateAdminDto>('newPassword')
    confirmPassword: string | undefined
}
