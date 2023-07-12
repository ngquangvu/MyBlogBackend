import { Controller, Get, Request, Post, Body, Bind, Param, Delete } from '@nestjs/common'
import { PostService } from '../services'
import { PostDto } from '../dtos'

@Controller('posts')
export class PostsController {
    constructor(private readonly _postService: PostService) {}

    @Post()
    @Bind(Request())
    async create(@Body() createPost: PostDto): Promise<PostDto> {
        return await this._postService.create({ ...createPost })
    }

    @Get('')
    async findAll(): Promise<PostDto[]> {
        return await this._postService.findAll()
    }

    @Get(':id')
    async findById(@Param('id') id: number): Promise<PostDto> {
        return await this._postService.findOne(id)
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this._postService.delete(id)
    }
}
