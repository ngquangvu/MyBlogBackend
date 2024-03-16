import { Controller, Get, Request, Post, Body, Bind, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { PaginationQueryDto } from 'src/common/dtos'
import { JwtAdminAuthGuard } from 'src/token/guards'
import { CategoriesService } from '../services'
import { CategoryDto } from '../dtos'

@Controller('categories')
export class CategoriesController {
    constructor(private readonly _cateService: CategoriesService) {}

    @Get()
    async findAll(@Query() catePaginationQuery: PaginationQueryDto) {
        return await this._cateService.findAll(catePaginationQuery)
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        return await this._cateService.findOne(id)
    }
}
