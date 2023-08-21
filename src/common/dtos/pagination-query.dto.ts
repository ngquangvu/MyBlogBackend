import { IsOptional, IsPositive, IsString } from 'class-validator'

export class PaginationQueryDto {
    @IsOptional()
    @IsPositive()
    readonly limit: number

    @IsOptional()
    @IsPositive()
    readonly page: number

    @IsOptional()
    @IsString()
    readonly search: string
}
