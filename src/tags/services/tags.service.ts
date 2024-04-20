import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { PaginationQueryDto } from 'src/common/dtos'
import { Prisma } from '@prisma/client'
import { TagDto } from '../dtos'
import { UpdateTagDto } from '../dtos/update-tag.dto'
import { getFileNameAndExtension, unlinkFile } from 'src/utils'

@Injectable()
export class TagsService {
    constructor(private readonly _prismaService: PrismaService) {}
    private uploadedURL = process.env.UPLOADED_FILES_URL + '/'

    // Define the select fields for the tag
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

    // Define the select fields for the tag for admin
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

    /*
     * Find a single tag by ID
     * @param id - The ID of the tag
     * @returns The tag object if found
     */
    async findOne(id: number) {
        const tag = await this._prismaService.tag.findFirst({
            where: {
                id
            },
            ...this._select
        })
        return { ...tag, image: tag?.image ? this.uploadedURL + tag.image : null }
    }

    /*
     * Find a single tag by slug
     * @param slug - The slug of the tag
     * @returns The tag object if found
     */
    async findSlug(slug: string) {
        const tag = await this._prismaService.tag.findFirst({
            where: {
                slug
            },
            ...this._select
        })
        return tag ? (tag?.image ? { ...tag, image: this.uploadedURL + tag.image } : { ...tag }) : null
    }

    /*
     * Find all tags
     * @param paginationQuery - The pagination query
     * @param byAdmin - The flag to determine if the request is from admin
     * @returns The list of tags
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
            this._prismaService.tag.count({
                where: {
                    ...or,
                    deletedAt: null
                }
            }),
            this._prismaService.tag.findMany({
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
            data: data.map((tag) => {
                return {
                    ...tag,
                    image: tag?.image ? this.uploadedURL + tag.image : null
                }
            }),
            totalCount
        }
    }

    /*
     * Get all tags
     * @returns The list of tags
     */
    async getAll() {
        const data = await this._prismaService.tag.findMany({
            where: {
                deletedAt: null
            },
            orderBy: { id: Prisma.SortOrder.asc },
            ...this._select
        })

        return [
            ...data.map((tag) => {
                return {
                    ...tag,
                    image: tag?.image ? this.uploadedURL + tag.image : null
                }
            })
        ]
    }

    /*
     * Create a new tag
     * @param createData - The data for creating the tag
     * @param imageFile - The image file for the tag
     * @returns The created tag object
     */
    async create(createData: TagDto, imageFile: Express.Multer.File) {
        return await this._prismaService.tag.create({
            data: {
                ...createData,
                image: imageFile ? imageFile.filename : undefined
            },
            ...this._select
        })
    }

    /*
     * Update a tag
     * @param id - The ID of the tag
     * @param updateData - The data for updating the tag
     * @param imageFile - The image file for the tag
     * @returns The updated tag object
     */
    async update(id: number, updateData: UpdateTagDto, imageFile: Express.Multer.File) {
        // Check if the image file is provided
        if (imageFile) {
            const tag = await this.findOne(id)
            if (tag && tag.image) {
                unlinkFile(process.env.UPLOADED_FILES_PATH + '/' + getFileNameAndExtension(tag.image))
            }
        }

        return await this._prismaService.tag.update({
            where: { id },
            data: {
                ...updateData,
                image: imageFile ? imageFile.filename : undefined
            },
            ...this._selectAdmin
        })
    }

    /*
     * Delete a tag
     * @param id - The ID of the tag
     * @returns The deleted tag object
     */
    async delete(id: number) {
        return this._prismaService.tag.update({
            data: {
                deletedAt: new Date()
            },
            where: { id }
        })
    }

    /*
     * Restore a tag
     * @param id - The ID of the tag
     * @returns The restored tag object
     */
    async restore(id: number) {
        return this._prismaService.tag.update({
            data: {
                deletedAt: null
            },
            where: { id }
        })
    }
}
