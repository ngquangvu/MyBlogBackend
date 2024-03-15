import { Tag } from '@prisma/client'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class TagDto implements Omit<Tag, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
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
