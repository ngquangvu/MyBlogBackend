import { PartialType } from '@nestjs/mapped-types'
import { CategoryDto } from 'src/categories/dtos'

export class UpdateCategoryDto extends PartialType(CategoryDto) {}
