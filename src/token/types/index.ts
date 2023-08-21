import { CookieOptions } from 'express'

export type JwtPayload = {
    email: string
    sub: string
}

export type AccessTokenForCookie = {
    access_token: string
    options: CookieOptions
}

export type RefreshTokenForCookie = {
    refresh_token: string
    options: CookieOptions
}
