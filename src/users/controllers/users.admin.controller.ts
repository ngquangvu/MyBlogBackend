import { Controller, Request, Post, Body, Bind, UseGuards, Get, Param, Query } from '@nestjs/common'
import { UserService } from '../services/users.service'
import { JwtAdminAuthGuard } from 'src/token/guards'
import { log } from 'console'

@Controller('/admin/users')
@UseGuards(JwtAdminAuthGuard)
export class AdminUsersController {
    constructor(private readonly _userService: UserService) {}
    @Get()
    @Bind(Request())
    async getUsers() {
        return await this._userService.findAll()
    }

    @Get(':id')
    @Bind(Request())
    async getUser(@Param('id') id: string) {
        return await this._userService.findOne(id)
    }
}
