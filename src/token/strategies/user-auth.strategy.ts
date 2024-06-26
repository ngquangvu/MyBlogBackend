import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from 'src/authentication/services'
import { UserService } from 'src/users/services'

@Injectable()
export class UserAuthStrategy extends PassportStrategy(Strategy, 'user-auth') {
    constructor(private readonly _authenticationService: AuthService, private readonly _userService: UserService) {
        super({ usernameField: 'email' })
    }

    /*
     * Validate the user credentials
     * @param email - The email of the user
     * @param password - The password of the user
     * @returns The user object
     * @throws UnauthorizedException if the user is not valid
     */
    async validate(email: string, password: string) {
        const validateUser = await this._authenticationService.validateUser(email, password)
        if (!validateUser) {
            throw new UnauthorizedException()
        }

        const user = await this._userService.findOneByEmail(email)
        return user
    }
}
