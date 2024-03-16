import { Controller, Request, Bind, UseGuards, Get, Param, Query, Body, Post, Patch, Delete } from '@nestjs/common'
import { UserService } from '../services/users.service'
import { JwtAdminAuthGuard } from 'src/token/guards'
import { PaginationQueryDto } from 'src/common/dtos'
import { RegisterUserDto } from 'src/authentication/dtos'
import { UpdateUserDto } from '../dtos'

@Controller('/admin/users')
@UseGuards(JwtAdminAuthGuard)
export class AdminUsersController {
    constructor(private readonly _userService: UserService) {}

    @Post()
    @Bind(Request())
    async register(@Body() registerUserDto: RegisterUserDto) {
        return await this._userService.userRegister(registerUserDto)
    }

    @Patch(':id')
    @Bind(Request())
    async updateAdmin(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this._userService.update(id, updateUserDto)
    }

    @Get()
    @Bind(Request())
    async getUsers(@Query() userPaginationQuery: PaginationQueryDto) {
        return await this._userService.findAll(userPaginationQuery, true)
    }

    @Get(':id')
    @Bind(Request())
    async getUser(@Param('id') id: string) {
        return await this._userService.findOne(id)
    }

    @Delete(':id')
    @Bind(Request())
    delete(@Param('id') id: string) {
        return this._userService.delete(id)
    }

    @Patch('/restore/:id')
    @Bind(Request())
    async restore(@Param('id') id: string) {
        return await this._userService.restore(id)
    }
}
