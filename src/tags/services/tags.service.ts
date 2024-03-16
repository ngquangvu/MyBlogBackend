import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { PaginationQueryDto } from 'src/common/dtos'
import { Prisma } from '@prisma/client'
import { TagDto } from '../dtos'
import { UpdateTagDto } from '../dtos/update-tag.dto'

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

    private readonly _selectAdmin = {
        select: {
            id: true,
            title: true,
            metaTitle: true,
            slug: true,
            content: true,
            image: true,

            createdAt: true,
            updatedAt: true,
            deletedAt: true
        }
    }

    async findOne(id: number) {
        const tag = await this._prismaService.tag.findFirst({
            where: {
                id
            },
            ...this._select
        })
        return tag
    }

    async findSlug(slug: string) {
        const tag = await this._prismaService.tag.findFirst({
            where: {
                slug
            },
            ...this._select
        })
        return tag
    }

    async findAll(paginationQuery: PaginationQueryDto, byAdmin = false) {
        const { page = 1, limit = 10, search = undefined } = paginationQuery

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
                select: byAdmin ? this._selectAdmin.select : this._select.select
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

    async update(id: number, updateData: UpdateTagDto) {
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
