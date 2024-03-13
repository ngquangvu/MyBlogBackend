import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { PostDto } from '../dtos'
import { PaginationQueryDto } from 'src/common/dtos'
import { Prisma } from '@prisma/client'
import { CategoriesService } from 'src/categories/services'

@Injectable()
export class PostService {
    constructor(private readonly _prismaService: PrismaService, private readonly _cateService: CategoriesService) {}

    private readonly _select = {
        select: {
            id: true,
            authorId: true,
            parentId: true,
            title: true,
            metaTitle: true,
            slug: true,
            summary: true,
            content: true,
            thumbnail: true,
            url: true,
            published: true,
            postTags: {
                select: {
                    tagId: true
                }
            },
            postCategories: {
                select: {
                    categoryId: true
                }
            },
            comments: true,

            createdAt: true,
            updatedAt: true
        }
    }

    async findOne(id: string) {
        const post = await this._prismaService.post.findFirst({
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
            this._prismaService.post.count({
                where: {
                    ...or,
                    deletedAt: null
                }
            }),
            this._prismaService.post.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    ...or,
                    deletedAt: null
                },
                orderBy: { updatedAt: Prisma.SortOrder.desc },
                ...this._select
            })
        ])

        const categories = await this._cateService.getAll()

        return {
            data: data.map((post) => {
                return {
                    ...post,
                    postCategories: categories.filter((allCate) =>
                        post.postCategories.find((postCate) => postCate.categoryId === allCate.id)
                    )
                }
            }),
            totalCount
        }
    }

    async create(createData: PostDto) {
        return await this._prismaService.post.create({
            data: {
                ...createData
            },
            ...this._select
        })
    }

    async update(updateData: PostDto, id: string) {
        return await this._prismaService.post.update({
            where: { id },
            data: {
                ...updateData
            },
            ...this._select
        })
    }

    async delete(id: string) {
        return this._prismaService.post.delete({ where: { id } })
    }
}
