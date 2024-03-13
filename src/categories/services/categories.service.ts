import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { PaginationQueryDto } from 'src/common/dtos'
import { Prisma } from '@prisma/client'
import { CategoryDto } from '../dtos'

@Injectable()
export class CategoriesService {
    constructor(private readonly _prismaService: PrismaService) {}

    private readonly _select = {
        select: {
            id: true,
            parentId: true,
            title: true,
            metaTitle: true,
            slug: true,
            content: true,
            image: true
        }
    }

    async findOne(id: number) {
        const post = await this._prismaService.category.findFirst({
            where: {
                id
            },
            ...this._select
        })
        return post
    }

    async findAll(postPaginationQuery: PaginationQueryDto) {
        const { page = 1, limit = 10, search = undefined } = postPaginationQuery

        const or = search
            ? {
                  OR: [
                      { title: { contains: search } },
                      { summary: { contains: search } },
                      { content: { contains: search } }
                  ]
              }
            : {}

        const [totalCount, data] = await Promise.all([
            this._prismaService.category.count({
                where: {
                    ...or
                }
            }),
            this._prismaService.category.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    ...or
                },
                orderBy: { id: Prisma.SortOrder.desc },
                ...this._select
            })
        ])

        return {
            data,
            totalCount
        }
    }

    async getAll() {
        const data = await this._prismaService.category.findMany({
            orderBy: { id: Prisma.SortOrder.asc },
            ...this._select
        })

        return data
    }

    async create(createData: CategoryDto) {
        return await this._prismaService.category.create({
            data: {
                ...createData
            },
            ...this._select
        })
    }

    async update(updateData: CategoryDto, id: number) {
        return await this._prismaService.category.update({
            where: { id },
            data: {
                ...updateData
            },
            ...this._select
        })
    }

    async delete(id: number) {
        return this._prismaService.category.delete({ where: { id } })
    }
}
