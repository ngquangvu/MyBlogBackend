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
import { PaginationQueryDto } from 'src/common/dtos'
import { JwtAdminAuthGuard } from 'src/token/guards'
import { CategoriesService } from '../services'
import { CategoryDto } from '../dtos'
import { UpdateCategoryDto } from '../dtos/update-category.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from 'src/app/interceptors'

@Controller('admin/categories')
@UseGuards(JwtAdminAuthGuard)
export class CategoriesAdminController {
    constructor(private readonly _cateService: CategoriesService) {}

    @Post()
    @Bind(Request())
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async create(@Body() createCate: CategoryDto, @UploadedFile() image: Express.Multer.File) {
        return await this._cateService.create(createCate, image)
    }

    @Patch(':id')
    @Bind(Request())
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async updateAdmin(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateCategoryDto,
        @UploadedFile() image: Express.Multer.File
    ) {
        return await this._cateService.update(id, updateUserDto, image)
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
    async delete(@Param('id') id: number) {
        return await this._cateService.delete(id)
    }

    @Patch('/restore/:id')
    @Bind(Request())
    async restore(@Param('id') id: number) {
        return await this._cateService.restore(id)
    }
}
