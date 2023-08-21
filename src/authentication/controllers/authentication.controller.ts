import { Bind, Body, Controller, HttpCode, HttpStatus, Get, Post, Res, UseGuards, Request } from '@nestjs/common'
import { RegisterUserDto } from 'src/authentication/dtos'
import { AuthService } from 'src/authentication/services'
import { Response } from 'express'
import { TokenService } from 'src/token/services'
import { JwtAuthGuard, JwtRefreshAuthGuard, UserAuthGuard } from 'src/token/guards'
import { UserRequest, UserResponseType } from 'src/users/types'

@Controller('authentication')
export class AuthController {
    constructor(private readonly _authService: AuthService, private readonly _tokenService: TokenService) {}

    @UseGuards(JwtRefreshAuthGuard)
    @Get('refresh')
    @Bind(Request())
    async refresh(request: UserRequest, @Res({ passthrough: true }) response: Response): Promise<UserResponseType> {
        await this._tokenService.setTokensToHeader(response, request.user)
        return request.user
    }

    @Post('registration')
    @HttpCode(HttpStatus.OK)
    async registration(@Body() createUser: RegisterUserDto): Promise<UserResponseType> {
        const newUser = await this._authService.registration(createUser)
        return newUser
    }

    @Post('login')
    @UseGuards(UserAuthGuard)
    @Bind(Request())
    async login(request: UserRequest, @Res({ passthrough: true }) response: Response): Promise<UserResponseType> {
        await this._tokenService.setTokensToHeader(response, request.user)
        return request.user
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Bind(Request())
    async logOut(request: UserRequest, @Res({ passthrough: true }) response: Response) {
        await this._tokenService.logout(response)
        return
    }
}
