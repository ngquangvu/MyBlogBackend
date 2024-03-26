import { Category } from '@prisma/client'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CategoryDto implements Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    @IsString()
    @IsOptional()
    readonly parentId: string

    @IsString()
    @IsNotEmpty()
    readonly title: string

    @IsString()
    @IsOptional()
    readonly metaTitle: string

    @IsString()
    @IsOptional()
    readonly slug: string

    @IsString()
    @IsOptional()
    readonly image: string

    @IsString()
    @IsOptional()
    readonly content: string
}
