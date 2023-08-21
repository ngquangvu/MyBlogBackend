import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from 'src/users/services'
import { JwtPayload } from '../types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly _userService: UserService, readonly _configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request) => request.cookies.access_token]),
            ignoreExpiration: false,
            secretOrKey: _configService.get<string>('JWT_ACCESS_SECRET'),
            issuer: _configService.get<string>('APP_NAME'),
            audience: _configService.get<string>('FRONT_URL')
        })
    }

    async validate(payload: JwtPayload) {
        return await this._userService.findOneByEmail(payload.email)
    }
}
