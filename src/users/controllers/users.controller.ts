import { Controller, Get, Body, Param, Delete, Put } from '@nestjs/common'
import { UpdateUserDto, UserDto } from '../dtos'
import { UserService } from '../services/users.service'

@Controller('users')
export class UsersController {
    constructor(private readonly _userService: UserService) {}

    @Get('/')
    async findAll(): Promise<UserDto[]> {
        return await this._userService.findAll()
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<UserDto> {
        return await this._userService.findOne(id)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
        return await this._userService.update(id, updateUserDto)
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<UserDto> {
        return await this._userService.delete(id)
    }
}
