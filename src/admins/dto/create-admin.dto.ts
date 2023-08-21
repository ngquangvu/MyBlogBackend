import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { AdminDto } from './admin.dto'

export class CreateAdminDto extends AdminDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(32)
    @Matches(/^([a-zA-Z0-9@#\$%&?!]+)$/, {
        message: 'Special characters can be used for password'
    })
    readonly password: string
}
