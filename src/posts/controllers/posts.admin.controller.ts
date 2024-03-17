import { Controller, Get, Request, Post, Body, Bind, Param, Delete, UseGuards, Query, Patch } from '@nestjs/common'
import { PostService } from '../services'
import { PostDto } from '../dtos'
import { JwtAdminAuthGuard } from 'src/token/guards'
import { PostPaginationQueryDto } from 'src/common/dtos/post-pagination-query.dto'

@Controller('admin/posts')
@UseGuards(JwtAdminAuthGuard)
export class PostsAdminController {
    constructor(private readonly _postService: PostService) {}

    @Post()
    @Bind(Request())
    async create(@Body() createPost: PostDto) {
        return await this._postService.create(createPost)
    }

    @Get()
    async findAll(@Query() postPaginationQuery: PostPaginationQueryDto) {
        return await this._postService.findAll(postPaginationQuery, true)
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this._postService.findOne(id)
    }

    @Delete(':id')
    @UseGuards(JwtAdminAuthGuard)
    async delete(@Param('id') id: string) {
        return await this._postService.delete(id)
    }

    @Patch('/restore/:id')
    @Bind(Request())
    async restore(@Param('id') id: string) {
        return await this._postService.restore(id)
    }
}
