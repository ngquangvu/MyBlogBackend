import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
// import * as bcrypt from 'bcrypt'
// import { PrismaService } from 'src/prisma/service'
import { ConfigService } from '@nestjs/config'
import { AccessTokenForCookie, JwtPayload, RefreshTokenForCookie } from '../types'
import { AuthenticationResponseType } from 'src/authentication/types'
import { Response } from 'express'
import { NODE_ENV } from 'src/app/constants'

@Injectable()
export class TokenService {
    constructor(
        // private readonly _prismaService: PrismaService,
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService
    ) {}

    /*
     * Create an access token
     * @param payload - The payload for the token
     * @returns The access token
     */
    private async createAccessToken(payload: JwtPayload): Promise<string> {
        return this._jwtService.signAsync(payload, {
            secret: this._configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: this._configService.get<number>('JWT_ACCESS_EXPIRATION_TIME'),
            issuer: this._configService.get<string>('APP_NAME'),
            audience: this._configService.get<string>('FRONT_URL')
        })
    }

    /*
     * Create a refresh token
     * @param payload - The payload for the token
     * @returns The refresh token
     */
    private async createRefreshToken(payload: JwtPayload): Promise<string> {
        return this._jwtService.signAsync(payload, {
            secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this._configService.get<number>('JWT_REFRESH_EXPIRATION_TIME'),
            issuer: this._configService.get<string>('APP_NAME'),
            audience: this._configService.get<string>('FRONT_URL')
        })
    }

    /*
     * Verify the token
     * @param token - The token to verify
     * @returns The payload of the token
     */
    private async getCookieWithJwtAccessToken(
        authentication: AuthenticationResponseType
    ): Promise<AccessTokenForCookie> {
        const payload: JwtPayload = { email: authentication.email, sub: authentication.id }

        const accessToken = await this.createAccessToken(payload)

        return {
            access_token: accessToken,
            options: {
                expires: new Date(Date.now() + this._configService.get<number>('JWT_ACCESS_EXPIRATION_TIME')),
                // httpOnly: true,
                path: '/',
                maxAge: this._configService.get<number>('JWT_ACCESS_EXPIRATION_TIME') * 1000,
                sameSite: 'strict'
            }
        }
    }

    /*
     * Verify the token
     * @param token - The token to verify
     * @returns The payload of the token
     */
    private async getCookieWithJwtRefreshToken(
        authentication: AuthenticationResponseType
    ): Promise<RefreshTokenForCookie> {
        const payload: JwtPayload = { email: authentication.email, sub: authentication.id }

        const refreshToken = await this.createRefreshToken(payload)

        return {
            refresh_token: refreshToken,
            options: {
                expires: new Date(Date.now() + this._configService.get<number>('JWT_REFRESH_EXPIRATION_TIME')),
                // httpOnly: true,
                path: '/',
                maxAge: this._configService.get<number>('JWT_REFRESH_EXPIRATION_TIME') * 1000,
                sameSite: 'strict'
            }
        }
    }

    /*
     * Set the tokens to the header
     * @param response - The response object
     * @param authentication - The authentication object
     */
    async setTokensToHeader(response: Response, authentication: AuthenticationResponseType): Promise<void> {
        const accessTokenCookie = await this.getCookieWithJwtAccessToken(authentication)
        const refreshTokenCookie = await this.getCookieWithJwtRefreshToken(authentication)
        const secure = false

        response.cookie('access_token', accessTokenCookie.access_token, { ...accessTokenCookie.options, secure })
        response.cookie('refresh_token', refreshTokenCookie.refresh_token, { ...refreshTokenCookie.options, secure })
    }

    /*
     * Set the tokens to the header
     * @param response - The response object
     * @param authentication - The authentication object
     */
    async logout(response: Response): Promise<void> {
        response.clearCookie('access_token')
        response.clearCookie('refresh_token')
    }
}
