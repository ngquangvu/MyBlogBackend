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

    // Define the select fields for the category
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

    // Define the select fields for the category for admin
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

    /*
     * Find a single category by ID
     * @param id - The ID of the category
     * @returns The category object if found
     */
    async findOne(id: number) {
        const cate = await this._prismaService.category.findFirst({
            where: {
                id
            },
            ...this._select
        })
        return cate ? (cate?.image ? { ...cate, image: this.uploadedURL + cate.image } : { ...cate }) : null
    }

    /*
     * Find a category by slug
     * @param slug - The slug of the category
     * @returns The category object if found
     */
    async findSlug(slug: string) {
        const cate = await this._prismaService.category.findFirst({
            where: {
                slug
            },
            ...this._select
        })
        return cate ? (cate?.image ? { ...cate, image: this.uploadedURL + cate.image } : { ...cate }) : null
    }

    /*
     * Find all categories
     * @param paginationQuery - The pagination query
     * @param byAdmin - The flag to determine if the request is from admin
     * @returns The list of categories
     */
    async findAll(paginationQuery: PaginationQueryDto, byAdmin = false) {
        const { page = 1, limit = 10, search = undefined } = paginationQuery

        // Define the OR condition for the search
        const or = search
            ? {
                  OR: [
                      { title: { contains: search } },
                      { summary: { contains: search } },
                      { content: { contains: search } }
                  ]
              }
            : {}

        // Get the total count and the data
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
                    ...or,
                    deletedAt: null
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

    /*
     * Find all categories
     * @returns The list of categories
     */
    async getAll() {
        const data = await this._prismaService.category.findMany({
            where: {
                deletedAt: null
            },
            orderBy: { id: Prisma.SortOrder.asc },
            ...this._select
        })

        return {
            data: [
                ...data.map((cate) => {
                    return {
                        ...cate,
                        image: cate?.image ? this.uploadedURL + cate.image : null
                    }
                })
            ]
        }
    }

    /*
     * Create a new category
     * @param createData - The data for creating the category
     * @param imageFile - The image file for the category
     * @returns The new category object
     */
    async create(createData: CategoryDto, imageFile: Express.Multer.File) {
        return await this._prismaService.category.create({
            data: {
                ...createData,
                image: imageFile ? imageFile.filename : undefined
            },
            ...this._select
        })
    }

    /*
     * Update a category
     * @param id - The ID of the category
     * @param updateData - The data for updating the category
     * @param imageFile - The image file for the category
     * @returns The updated category object
     */
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

    /*
     * Delete a category
     * @param id - The ID of the category
     * @returns The deleted category object
     */
    async delete(id: number) {
        return this._prismaService.category.update({
            data: {
                deletedAt: new Date()
            },
            where: { id }
        })
    }

    /*
     * Restore a category
     * @param id - The ID of the category
     * @returns The restored category object
     */
    async restore(id: number) {
        return this._prismaService.category.update({
            data: {
                deletedAt: null
            },
            where: { id }
        })
    }
}
