import { Controller, Post, UseGuards, Request, Bind, Res, HttpCode, HttpStatus, Get } from '@nestjs/common'
import { Response } from 'express'
import { TokenAdminService } from 'src/token/services'
import { JwtAdminAuthGuard, JwtAdminRefreshAuthGuard, AdminAuthGuard } from 'src/token/guards'
import { AdminRequest, AdminResponseType } from 'src/admins/types'

@Controller('admin/authentication')
export class AuthAdminController {
    constructor(private readonly _tokenAdminService: TokenAdminService) {}

    @UseGuards(AdminAuthGuard)
    @Post('login')
    @Bind(Request())
    async login(request: AdminRequest, @Res({ passthrough: true }) response: Response): Promise<AdminResponseType> {
        await this._tokenAdminService.setTokensToHeader(response, request.user)

        return request.user
    }

    @UseGuards(JwtAdminRefreshAuthGuard)
    @Get('refresh')
    @Bind(Request())
    async refresh(request: AdminRequest, @Res({ passthrough: true }) response: Response): Promise<AdminResponseType> {
        await this._tokenAdminService.setTokensToHeader(response, request.user)
        return request.user
    }

    @UseGuards(JwtAdminAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @Bind(Request())
    async logOut(_, @Res({ passthrough: true }) response: Response) {
        await this._tokenAdminService.logout(response)
        return
    }
}
