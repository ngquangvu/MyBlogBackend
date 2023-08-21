import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from '../types'
import { AdminService } from 'src/admins/services'

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
    constructor(private readonly _adminService: AdminService, readonly _configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request) => request.cookies.admin_access_token]),
            ignoreExpiration: false,
            secretOrKey: _configService.get<string>('JWT_ADMIN_ACCESS_SECRET'),
            issuer: _configService.get<string>('APP_NAME'),
            audience: _configService.get<string>('ADMIN_DOMAIN')
        })
    }

    async validate(payload: JwtPayload) {
        return await this._adminService.findOneByEmail(payload.email)
    }
}
