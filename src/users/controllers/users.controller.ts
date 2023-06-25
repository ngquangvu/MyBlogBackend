import { Controller, Get, Request, Post, Body, Bind, Param, ParseUUIDPipe, Delete, Put } from '@nestjs/common'
import { User } from '@prisma/client'
import { CreateUserDTO, UserDTO, UpdateUserDTO } from '../dtos'
import { UserService } from '../services/users.service'

@Controller('users')
export class UsersController {
    constructor(private readonly _userService: UserService) {}

    @Post()
    @Bind(Request())
    async create(@Body() createUserDTO: CreateUserDTO) {
        return await this._userService.create(createUserDTO)
    }

    @Get('/')
    async findAll(): Promise<User[]> {
        return await this._userService.findAll()
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<User> {
        return await this._userService.findOne(id)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO): Promise<User> {
        return await this._userService.update(id, updateUserDTO)
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<User> {
        return await this._userService.delete(id)
    }
}
