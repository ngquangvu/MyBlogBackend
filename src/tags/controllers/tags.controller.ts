import { Controller, Get, Param, Query } from '@nestjs/common'
import { PaginationQueryDto } from 'src/common/dtos'
import { TagsService } from '../services'

@Controller('tags')
export class TagsController {
    constructor(private readonly _tagService: TagsService) {}

    @Get()
    async findAll(@Query() tagPaginationQuery: PaginationQueryDto) {
        return await this._tagService.findAll(tagPaginationQuery)
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        return await this._tagService.findOne(id)
    }
}
