import { Controller, Get, Request, Post, Body, Bind, Param, Delete, UseGuards, Query, Patch } from '@nestjs/common'
import { PaginationQueryDto } from 'src/common/dtos'
import { JwtAdminAuthGuard } from 'src/token/guards'
import { TagsService } from '../services'
import { TagDto } from '../dtos'
import { UpdateTagDto } from '../dtos/update-tag.dto'

@Controller('admin/tags')
@UseGuards(JwtAdminAuthGuard)
export class TagsAdminController {
    constructor(private readonly _tagService: TagsService) {}

    @Post()
    @Bind(Request())
    async create(@Body() createTag: TagDto) {
        return await this._tagService.create(createTag)
    }

    @Patch(':id')
    @Bind(Request())
    async updateAdmin(@Param('id') id: number, @Body() updateUserDto: UpdateTagDto) {
        return await this._tagService.update(id, updateUserDto)
    }

    @Get()
    async findAll(@Query() tagPaginationQuery: PaginationQueryDto) {
        return await this._tagService.findAll(tagPaginationQuery, true)
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        return await this._tagService.findOne(id)
    }

    @Delete(':id')
    @UseGuards(JwtAdminAuthGuard)
    async delete(@Param('id') id: number) {
        return await this._tagService.delete(id)
    }

    @Patch('/restore/:id')
    @Bind(Request())
    async restore(@Param('id') id: number) {
        return await this._tagService.restore(id)
    }
}
