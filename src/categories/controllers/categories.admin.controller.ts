import { Controller, Get, Request, Post, Body, Bind, Param, Delete, UseGuards, Query, Patch } from '@nestjs/common'
import { PaginationQueryDto } from 'src/common/dtos'
import { JwtAdminAuthGuard } from 'src/token/guards'
import { CategoriesService } from '../services'
import { CategoryDto } from '../dtos'
import { UpdateCategoryDto } from '../dtos/update-category.dto'

@Controller('admin/categories')
@UseGuards(JwtAdminAuthGuard)
export class CategoriesAdminController {
    constructor(private readonly _cateService: CategoriesService) {}

    @Post()
    @Bind(Request())
    async create(@Body() createCate: CategoryDto) {
        return await this._cateService.create(createCate)
    }

    @Patch(':id')
    @Bind(Request())
    async updateAdmin(@Param('id') id: number, @Body() updateUserDto: UpdateCategoryDto) {
        return await this._cateService.update(id, updateUserDto)
    }

    @Get()
    async findAll(@Query() catePaginationQuery: PaginationQueryDto) {
        return await this._cateService.findAll(catePaginationQuery, true)
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        return await this._cateService.findOne(id)
    }

    @Delete(':id')
    @UseGuards(JwtAdminAuthGuard)
    async delete(@Param('id') id: number) {
        return await this._cateService.delete(id)
    }
}
