import { Post } from '@prisma/client'
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class PostDto implements Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    @IsNumber()
    @IsNotEmpty()
    readonly authorId: string

    @IsString()
    @IsOptional()
    readonly parentId: number

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
    readonly summary: string

    @IsString()
    @IsNotEmpty()
    readonly content: string

    @IsString()
    @IsOptional()
    readonly thumbnail: string

    @IsString()
    @IsOptional()
    readonly url: string

    @IsBoolean()
    @IsOptional()
    readonly published: boolean
}
