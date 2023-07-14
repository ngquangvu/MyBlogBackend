//src/auth/auth.controller.ts

import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthEntity } from './entity/auth.entity'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './jwt-auth.guard'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOkResponse({ type: AuthEntity })
    login(@Body() { email, password }: LoginDto) {
        return this.authService.login(email, password)
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logOut(@Res({ passthrough: true }) response: Response) {
        await this.authService.logout(response)
        return
    }
}
