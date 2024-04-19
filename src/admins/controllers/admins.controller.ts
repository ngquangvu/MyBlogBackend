import { Bind, Controller, Get, UseGuards, Request, Query, Patch, Param, Body, Delete, Post, Res } from '@nestjs/common'
import { JwtAdminAuthGuard } from 'src/token/guards'

import { AdminRequest } from '../types'
import { AdminService } from '../services'
import { CreateAdminDto, UpdateAdminDto } from '../dto'
import { PaginationQueryDto } from 'src/common/dtos'

@Controller('admin/admins')
@UseGuards(JwtAdminAuthGuard)
export class AdminController {
    constructor(private readonly _adminService: AdminService) {}

    @Post()
    @Bind(Request())
    async create(@Body() createAdminDto: CreateAdminDto) {
        return await this._adminService.create(createAdminDto)
    }

    @Get()
    @Bind(Request())
    async getAdmins(@Query() adminPaginationQuery: PaginationQueryDto) {
        return await this._adminService.findMany(adminPaginationQuery)
    }

    @Get('/user/:email')
    @Bind(Request())
    async getUserAdmin(@Param('email') email: string) {
        return await this._adminService.findUserAdmin(email)
    }

    @Get(':id')
    @Bind(Request())
    async getAdmin(@Param('id') id: string) {
        return await this._adminService.findOne(id)
    }

    @Patch(':id')
    @Bind(Request())
    async updateAdmin(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
        return await this._adminService.update(id, updateAdminDto)
    }

    @Delete(':id')
    @Bind(Request())
    delete(request: AdminRequest, @Param('id') id: string) {
        return this._adminService.delete(id, request.user)
    }
}
