import { IsOptional, IsString } from 'class-validator'
import { PaginationQueryDto } from './pagination-query.dto'

export class PostPaginationQueryDto extends PaginationQueryDto {
    @IsOptional()
    @IsString()
    readonly cate: string

    @IsOptional()
    @IsString()
    readonly tag: string

    @IsOptional()
    @IsString()
    readonly authorId: string

    @IsOptional()
    @IsString()
    readonly sort: string // sort by 'recent' or 'relevant' or 'top'
}
