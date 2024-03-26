import { Post } from '@prisma/client'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class PostDto implements Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    @IsString()
    @IsNotEmpty()
    readonly authorId: string

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

    @IsBoolean()
    @IsOptional()
    readonly published: boolean
}
