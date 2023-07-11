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
    @IsNotEmpty()
    readonly metaTitle: string

    @IsString()
    @IsNotEmpty()
    readonly slug: string

    @IsString()
    @IsNotEmpty()
    readonly summary: string

    @IsString()
    @IsNotEmpty()
    readonly content: string

    @IsString()
    @IsNotEmpty()
    readonly thumbnail: string

    @IsString()
    @IsNotEmpty()
    readonly url: string

    @IsBoolean()
    @IsNotEmpty()
    readonly published: boolean
}
