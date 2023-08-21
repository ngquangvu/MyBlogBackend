import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
// import * as bcrypt from 'bcrypt'
// import { PrismaService } from 'src/prisma/service'
import { ConfigService } from '@nestjs/config'
import { AccessTokenForCookie, JwtPayload, RefreshTokenForCookie } from '../types'
import { AuthenticationResponseType } from 'src/authentication/types'
import { Response } from 'express'

@Injectable()
export class TokenAdminService {
    constructor(
        // private readonly _prismaService: PrismaService,
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService
    ) {}

    private async createAccessToken(payload: JwtPayload): Promise<string> {
        return this._jwtService.signAsync(payload, {
            secret: this._configService.get<string>('JWT_ADMIN_ACCESS_SECRET'),
            expiresIn: this._configService.get<number>('JWT_ADMIN_ACCESS_EXPIRATION_TIME'),
            issuer: this._configService.get<string>('APP_NAME'),
            audience: this._configService.get<string>('ADMIN_DOMAIN')
        })
    }

    private async createRefreshToken(payload: JwtPayload): Promise<string> {
        return this._jwtService.signAsync(payload, {
            secret: this._configService.get<string>('JWT_ADMIN_REFRESH_SECRET'),
            expiresIn: this._configService.get<number>('JWT_ADMIN_REFRESH_EXPIRATION_TIME'),
            issuer: this._configService.get<string>('APP_NAME'),
            audience: this._configService.get<string>('ADMIN_DOMAIN')
        })
    }

    private async getCookieWithJwtAccessToken(
        authentication: AuthenticationResponseType
    ): Promise<AccessTokenForCookie> {
        const payload: JwtPayload = { email: authentication.email, sub: authentication.id }

        const accessToken = await this.createAccessToken(payload)

        return {
            access_token: accessToken,
            options: {
                expires: new Date(Date.now() + this._configService.get<number>('JWT_ADMIN_ACCESS_EXPIRATION_TIME')),
                // httpOnly: true,
                path: '/',
                maxAge: this._configService.get<number>('JWT_ADMIN_ACCESS_EXPIRATION_TIME') * 1000,
                // secure: this._configService.get<string>('NODE_ENV') === NODE_ENV.PRODUCTION,
                sameSite: 'strict'
            }
        }
    }

    private async getCookieWithJwtRefreshToken(
        authentication: AuthenticationResponseType
    ): Promise<RefreshTokenForCookie> {
        const payload: JwtPayload = { email: authentication.email, sub: authentication.id }

        const refreshToken = await this.createRefreshToken(payload)

        return {
            refresh_token: refreshToken,
            options: {
                expires: new Date(Date.now() + this._configService.get<number>('JWT_ADMIN_REFRESH_EXPIRATION_TIME')),
                // httpOnly: true,
                path: '/',
                maxAge: this._configService.get<number>('JWT_ADMIN_REFRESH_EXPIRATION_TIME') * 1000,
                // secure: this._configService.get<string>('NODE_ENV') === NODE_ENV.PRODUCTION,
                sameSite: 'strict'
            }
        }
    }

    async setTokensToHeader(response: Response, authentication: AuthenticationResponseType): Promise<void> {
        const accessTokenCookie = await this.getCookieWithJwtAccessToken(authentication)
        const refreshTokenCookie = await this.getCookieWithJwtRefreshToken(authentication)
        // const secure = this._configService.get<string>('NODE_ENV') === NODE_ENV.PRODUCTION
        const secure = false

        // await this.updateHashedRefreshToken(authentication.id, refreshTokenCookie.refresh_token)
        response.cookie('admin_access_token', accessTokenCookie.access_token, { ...accessTokenCookie.options, secure })
        response.cookie('admin_refresh_token', refreshTokenCookie.refresh_token, {
            ...refreshTokenCookie.options,
            secure
        })
    }

    async logout(response: Response): Promise<void> {
        // this.updateHashedRefreshToken(authenticationId, null)
        response.clearCookie('admin_access_token')
        response.clearCookie('admin_refresh_token')
    }
}
