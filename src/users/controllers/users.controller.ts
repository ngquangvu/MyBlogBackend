import { Controller, Request, Post, Body, Bind } from '@nestjs/common'
import { UserService } from '../services/users.service'
import { RegisterUserDto } from 'src/authentication/dtos'

@Controller('/users')
export class UsersController {
    constructor(private readonly _userService: UserService) {}

    @Post()
    @Bind(Request())
    async register(@Body() registerUserDto: RegisterUserDto) {
        return await this._userService.userRegister(registerUserDto)
    }
}
