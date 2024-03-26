import {
    Controller,
    Get,
    Request,
    Post,
    Body,
    Bind,
    Param,
    Delete,
    UseGuards,
    Query,
    Patch,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common'
import { PostService } from '../services'
import { PostDto, UpdatePostDto } from '../dtos'
import { JwtAdminAuthGuard } from 'src/token/guards'
import { PostPaginationQueryDto } from 'src/common/dtos/post-pagination-query.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from 'src/app/interceptors'

@Controller('admin/posts')
@UseGuards(JwtAdminAuthGuard)
export class PostsAdminController {
    constructor(private readonly _postService: PostService) {}

    @Post()
    @Bind(Request())
    @UseInterceptors(FileInterceptor('thumbnailFile', multerOptions))
    async create(@Body() createPost: PostDto, @UploadedFile() thumbnailFile: Express.Multer.File) {
        return await this._postService.create(createPost, thumbnailFile)
    }

    @Patch(':id')
    @Bind(Request())
    @UseInterceptors(FileInterceptor('thumbnailFile', multerOptions))
    async updateAdmin(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @UploadedFile() thumbnailFile: Express.Multer.File
    ) {
        return await this._postService.update(id, updatePostDto, thumbnailFile, true)
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
