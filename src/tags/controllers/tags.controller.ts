import { Controller, Get, Request, Post, Body, Bind, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { PaginationQueryDto } from 'src/common/dtos'
import { JwtAdminAuthGuard } from 'src/token/guards'
import { TagsService } from '../services'
import { TagDto } from '../dtos'

@Controller('tags')
export class TagsController {
    constructor(private readonly _tagService: TagsService) {}

    @Post()
    @Bind(Request())
    async create(@Body() createTag: TagDto) {
        return await this._tagService.create(createTag)
    }

    @Get()
    async findAll(@Query() tagPaginationQuery: PaginationQueryDto) {
        return await this._tagService.findAll(tagPaginationQuery)
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
}
