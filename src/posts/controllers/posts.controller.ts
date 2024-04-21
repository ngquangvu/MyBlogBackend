import { Controller, Get, Param, Query } from '@nestjs/common'
import { PostService } from '../services'
import { PostPaginationQueryDto } from 'src/common/dtos/post-pagination-query.dto'

@Controller('posts')
export class PostsController {
    constructor(private readonly _postService: PostService) {}

    @Get()
    async findAll(@Query() postPaginationQuery: PostPaginationQueryDto) {
        return await this._postService.findAll(postPaginationQuery)
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this._postService.findOne(id)
    }

    @Get('k/:titleKey')
    async findByTitleKey(@Param('titleKey') titleKey: string) {
        return await this._postService.findTitleKey(titleKey)
    }
}
