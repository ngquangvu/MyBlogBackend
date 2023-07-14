import { Controller, Get, Request, Post, Body, Bind, Param, Delete, UseGuards } from '@nestjs/common'
import { PostService } from '../services'
import { PostDto } from '../dtos'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('posts')
export class PostsController {
    constructor(private readonly _postService: PostService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @Bind(Request())
    async create(@Body() createPost: PostDto): Promise<PostDto> {
        return await this._postService.create(createPost)
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    async findAll(): Promise<PostDto[]> {
        return await this._postService.findAll()
    }

    @Get(':id')
    async findById(@Param('id') id: number): Promise<PostDto> {
        return await this._postService.findOne(id)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: number) {
        return await this._postService.delete(id)
    }
}
