import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { UserDto } from './users.dto'

export class CreateUserDto extends UserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(16)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,16}$)/, {
        message: 'Password requirements has not been reached'
    })
    @Matches(/^([a-zA-Z0-9@#\$%&?!]+)$/, {
        message: 'Special characters can be used'
    })
    readonly password: string
}
