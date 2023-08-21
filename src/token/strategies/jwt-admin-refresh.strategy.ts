import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from '../types'
import { Request } from 'express'
import { AdminService } from 'src/admins/services'

@Injectable()
export class JwtAdminRefreshStrategy extends PassportStrategy(Strategy, 'jwt-admin-refresh') {
    constructor(private readonly _adminService: AdminService, readonly _configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request) => request.cookies.admin_refresh_token]),
            ignoreExpiration: false,
            secretOrKey: _configService.get<string>('JWT_ADMIN_REFRESH_SECRET'),
            passReqToCallback: true,
            issuer: _configService.get<string>('APP_NAME'),
            audience: _configService.get<string>('ADMIN_DOMAIN')
        })
    }

    async validate(request: Request, payload: JwtPayload) {
        const refreshToken = request.cookies.admin_refresh_token

        if (refreshToken) {
            return await this._adminService.findOneByEmail(payload.email)
        }
    }
}
