import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from '../types'
import { Request } from 'express'
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/users/services'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly _userService: UserService, readonly _configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request) => request.cookies.refresh_token]),
            ignoreExpiration: false,
            secretOrKey: _configService.get<string>('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
            issuer: _configService.get<string>('APP_NAME'),
            audience: _configService.get<string>('FRONT_URL')
        })
    }

    /*
     * Validate the user refresh token
     * @param request - The request object
     * @param payload - The payload of the token
     * @returns The user object if the token is valid
     */
    async validate(request: Request, payload: JwtPayload) {
        if (!payload) {
            throw new BadRequestException('Invalid token')
        }
        const refreshToken = request.cookies.refresh_token
        const access_token = request.cookies.access_token

        const hashedRefreshToken = access_token

        const isRefreshTokenMatching = await bcrypt.compare(refreshToken.slice(-72), hashedRefreshToken)
        if (isRefreshTokenMatching) {
            return await this._userService.findOneByEmail(payload.email)
        }
    }
}
