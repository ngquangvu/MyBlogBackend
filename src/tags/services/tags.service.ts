import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { PaginationQueryDto } from 'src/common/dtos'
import { Prisma } from '@prisma/client'
import { TagDto } from '../dtos'

@Injectable()
export class TagsService {
    constructor(private readonly _prismaService: PrismaService) {}

    private readonly _select = {
        select: {
            id: true,
            title: true,
            metaTitle: true,
            slug: true,
            content: true,
            image: true
        }
    }

    async findOne(id: number) {
        const post = await this._prismaService.tag.findFirst({
            where: {
                id
            },
            ...this._select
        })
        return post
    }

    async findSlug(slug: string) {
        const post = await this._prismaService.tag.findFirst({
            where: {
                slug
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
            this._prismaService.tag.count({
                where: {
                    ...or
                }
            }),
            this._prismaService.tag.findMany({
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
        const data = await this._prismaService.tag.findMany({
            orderBy: { id: Prisma.SortOrder.asc },
            ...this._select
        })

        return data
    }

    async create(createData: TagDto) {
        return await this._prismaService.tag.create({
            data: {
                ...createData
            },
            ...this._select
        })
    }

    async update(updateData: TagDto, id: number) {
        return await this._prismaService.tag.update({
            where: { id },
            data: {
                ...updateData
            },
            ...this._select
        })
    }

    async delete(id: number) {
        return this._prismaService.tag.update({
            data: {
                deletedAt: new Date()
            },
            where: { id }
        })
    }
}
