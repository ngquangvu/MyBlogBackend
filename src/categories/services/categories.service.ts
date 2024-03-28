import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { PaginationQueryDto } from 'src/common/dtos'
import { Prisma } from '@prisma/client'
import { CategoryDto } from '../dtos'
import { UpdateCategoryDto } from '../dtos/update-category.dto'
import { unlinkFile, getFileNameAndExtension } from 'src/utils'

@Injectable()
export class CategoriesService {
    constructor(private readonly _prismaService: PrismaService) {}
    private uploadedURL = process.env.UPLOADED_FILES_URL + '/'

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

    private readonly _selectAdmin = {
        select: {
            id: true,
            parentId: true,
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
        const cate = await this._prismaService.category.findFirst({
            where: {
                id
            },
            ...this._select
        })
        return { ...cate, image: cate?.image ? this.uploadedURL + cate.image : null }
    }

    async findSlug(slug: string) {
        const cate = await this._prismaService.category.findFirst({
            where: {
                slug
            },
            ...this._select
        })
        return { ...cate, image: cate?.image ? this.uploadedURL + cate.image : null }
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
                select: byAdmin ? this._selectAdmin.select : this._select.select
            })
        ])

        return {
            data: data.map((cate) => {
                return {
                    ...cate,
                    image: cate?.image ? this.uploadedURL + cate.image : null
                }
            }),
            totalCount
        }
    }

    async getAll() {
        const data = await this._prismaService.category.findMany({
            orderBy: { id: Prisma.SortOrder.asc },
            ...this._select
        })

        return {
            ...data.map((cate) => {
                return {
                    ...cate,
                    image: cate?.image ? this.uploadedURL + cate.image : null
                }
            })
        }
    }

    async create(createData: CategoryDto, imageFile: Express.Multer.File) {
        return await this._prismaService.category.create({
            data: {
                ...createData,
                image: imageFile ? imageFile.filename : undefined
            },
            ...this._select
        })
    }

    async update(id: number, updateData: UpdateCategoryDto, imageFile: Express.Multer.File) {
        if (imageFile) {
            const category = await this.findOne(id)
            if (category && category.image) {
                unlinkFile(process.env.UPLOADED_FILES_PATH + '/' + getFileNameAndExtension(category.image))
            }
        }

        return await this._prismaService.category.update({
            where: { id },
            data: {
                ...updateData,
                image: imageFile ? imageFile.filename : undefined
            },
            ...this._select
        })
    }

    async delete(id: number) {
        return this._prismaService.category.update({
            data: {
                deletedAt: new Date()
            },
            where: { id }
        })
    }

    async restore(id: number) {
        return this._prismaService.category.update({
            data: {
                deletedAt: null
            },
            where: { id }
        })
    }
}
