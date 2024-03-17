import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { PostDto } from '../dtos'
import { Prisma } from '@prisma/client'
import { PostPaginationQueryDto } from 'src/common/dtos/post-pagination-query.dto'
import { TagsService } from 'src/tags/services'

@Injectable()
export class PostService {
    constructor(private readonly _prismaService: PrismaService, private readonly _tagService: TagsService) {}

    private readonly _select = {
        select: {
            id: true,
            authorId: true,
            title: true,
            metaTitle: true,
            slug: true,
            summary: true,
            content: true,
            thumbnail: true,
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

    private readonly _selectAdmin = {
        select: {
            id: true,
            authorId: true,
            title: true,
            metaTitle: true,
            slug: true,
            summary: true,
            content: true,
            thumbnail: true,
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
            updatedAt: true,
            deletedAt: true
        }
    }

    async findOne(id: string) {
        const post = await this._prismaService.post.findFirst({
            where: {
                id
            },
            ...this._select
        })

        const tags = await this._tagService.getAll()

        return {
            ...post,
            postTags: tags.filter((allTag) => post.postTags.find((postTag) => postTag.tagId === allTag.id))
        }
    }

    async findAll(postPaginationQuery: PostPaginationQueryDto, byAdmin = false) {
        const { page = 1, limit = 10, search = undefined, cate = '', tag = '' } = postPaginationQuery

        const or = search
            ? {
                  OR: [
                      { title: { contains: search } },
                      { summary: { contains: search } },
                      { content: { contains: search } }
                  ]
              }
            : {}

        const tagObj = await this._tagService.findSlug(tag)

        const [totalCount, data] = await Promise.all([
            this._prismaService.post.count({
                where: {
                    ...or,
                    postTags: {
                        some: {
                            tagId: tagObj ? tagObj.id : tag === '' ? undefined : 0
                        }
                    },
                    deletedAt: byAdmin ? undefined : null
                }
            }),
            this._prismaService.post.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    ...or,
                    postTags: {
                        some: {
                            tagId: tagObj ? tagObj.id : tag === '' ? undefined : 0
                        }
                    },
                    deletedAt: byAdmin ? undefined : null
                },
                orderBy: byAdmin ? { createdAt: Prisma.SortOrder.desc } : { updatedAt: Prisma.SortOrder.desc },
                select: byAdmin ? this._selectAdmin.select : this._select.select
            })
        ])

        const categories = await this._tagService.getAll()

        return {
            data: data.map((post) => {
                return {
                    ...post,
                    postTags: categories.filter((allTag) =>
                        post.postTags.find((postTag) => postTag.tagId === allTag.id)
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
        return this._prismaService.post.update({ data: { deletedAt: new Date() }, where: { id } })
    }

    async restore(id: string) {
        return this._prismaService.post.update({ data: { deletedAt: null }, where: { id } })
    }
}
