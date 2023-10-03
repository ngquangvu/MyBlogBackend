import { Controller, Get, Request, Post, Body, Bind, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { PostService } from '../services'
import { PostDto } from '../dtos'
import { PaginationQueryDto } from 'src/common/dtos'
import { JwtAdminAuthGuard } from 'src/token/guards'

@Controller('posts')
export class PostsController {
    constructor(private readonly _postService: PostService) {}

    @Post()
    @Bind(Request())
    async create(@Body() createPost: PostDto) {
        return await this._postService.create(createPost)
    }

    @Get()
    async findAll(@Query() postPaginationQuery: PaginationQueryDto) {
        return await this._postService.findAll(postPaginationQuery)
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
}
