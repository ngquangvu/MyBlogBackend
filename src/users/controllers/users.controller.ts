import { Controller, Get, Body, Param, Delete, Put, UseGuards } from '@nestjs/common'
import { UpdateUserDto, UserDto } from '../dtos'
import { UserService } from '../services/users.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ApiBearerAuth } from '@nestjs/swagger'

@Controller('users')
export class UsersController {
    constructor(private readonly _userService: UserService) {}

    @Get('/')
    @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    async findAll(): Promise<UserDto[]> {
        return await this._userService.findAll()
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findById(@Param('id') id: string): Promise<UserDto> {
        return await this._userService.findOne(id)
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
        return await this._userService.update(id, updateUserDto)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string): Promise<UserDto> {
        return await this._userService.delete(id)
    }
}
