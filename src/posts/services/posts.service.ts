import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { PostDto, UpdatePostDto } from '../dtos'
import { ImageSizeType, Prisma } from '@prisma/client'
import { PostPaginationQueryDto } from 'src/common/dtos/post-pagination-query.dto'
import { TagsService } from 'src/tags/services'
import { unlinkFile } from 'src/utils'

@Injectable()
export class PostService {
    constructor(private readonly _prismaService: PrismaService, private readonly _tagService: TagsService) {}
    private uploadedURL = process.env.UPLOADED_FILES_URL + '/'

    // Define the select fields for the post
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

    // Define the select fields for the post for admin
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

    /**
     * Find a post by its ID
     * @param id - The ID of the post
     * @returns The found post
     */
    async findOne(id: string) {
        // Find the post by ID
        const post = await this._prismaService.post.findFirst({
            where: {
                id
            },
            ...this._select
        })

        // Get all tags
        const tags = await this._tagService.getAll()

        // Add additional data to the post
        return {
            ...post,
            thumbnail: post?.thumbnail ? this.uploadedURL + post.thumbnail : null,
            postTags: post.postTags.map((postTag) => this.getTagById(tags, postTag.tagId))
        }
    }

    /**
     * Find all posts
     * @param postPaginationQuery - The query parameters for pagination
     * @param byAdmin - If the request is made by an admin
     * @returns The list of posts
     */
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
        const tagId = tagObj ? tagObj.id : tag === '' ? null : 0
        const postTagsCondition = tagId ? { some: { tagId: tagId } } : tagId === null ? {} : { some: { tagId: 0 } }

        // Get the total count of posts and the list of posts
        const [totalCount, data] = await Promise.all([
            this._prismaService.post.count({
                where: {
                    ...or,
                    postTags: byAdmin ? { every: { tagId: undefined } } : postTagsCondition,
                    deletedAt: byAdmin ? undefined : null
                }
            }),
            this._prismaService.post.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    ...or,
                    postTags: byAdmin ? { every: { tagId: undefined } } : postTagsCondition,
                    deletedAt: byAdmin ? undefined : null
                },
                orderBy: byAdmin ? { createdAt: Prisma.SortOrder.desc } : { updatedAt: Prisma.SortOrder.desc },
                select: byAdmin ? this._selectAdmin.select : this._select.select
            })
        ])

        // Get all tags
        const tags = await this._tagService.getAll()

        return {
            data: data.map((post) => {
                return {
                    ...post,
                    thumbnail: post?.thumbnail ? this.uploadedURL + post.thumbnail : null,
                    postTags: post.postTags.map((postTag) => this.getTagById(tags, postTag.tagId))
                }
            }),
            totalCount
        }
    }

    /**
     * Create a new post
     * @param createData - The data for creating the post
     * @param thumbnailFile - The thumbnail file for the post
     * @param byAdmin - If the request is made by an admin
     * @returns The created post
     */
    async create(createData: PostDto, thumbnailFile: Express.Multer.File, byAdmin = false) {
        return await this._prismaService.post.create({
            data: {
                ...createData,
                thumbnail: thumbnailFile ? thumbnailFile.filename : undefined
            },
            select: byAdmin ? this._selectAdmin.select : this._select.select
        })
    }

    /**
     * Update a post
     * @param id - The ID of the post
     * @param updateData - The data for updating the post
     * @param thumbnailFile - The thumbnail file for the post
     * @param byAdmin - If the request is made by an admin
     * @returns The updated post
     */
    async update(id: string, updateData: UpdatePostDto, thumbnailFile: Express.Multer.File, byAdmin = false) {
        // If the thumbnail file is provided, delete the old thumbnail file
        if (thumbnailFile) {
            const post = await this.findOne(id)
            if (post && post.thumbnail) {
                unlinkFile(process.env.UPLOADED_FILES_PATH + '/' + post.thumbnail)
            }
        }
        return await this._prismaService.post.update({
            where: { id },
            data: {
                ...updateData,
                thumbnail: thumbnailFile ? thumbnailFile.filename : undefined
            },
            select: byAdmin ? this._selectAdmin.select : this._select.select
        })
    }

    /**
     * Upload an image
     * @param author - The author of the image
     * @param imageFile - The image file
     * @returns The uploaded image
     */
    async uploadImage(author: { userId: string }, imageFile: Express.Multer.File) {
        // get file size in KB
        const fileSize = Math.round(imageFile.size / Math.pow(2, 10))

        // get file sizeType
        let sizeType: ImageSizeType = ImageSizeType.MEDIUM
        if (fileSize < 500) {
            sizeType = ImageSizeType.THUMBNAIL
        } else if (fileSize < 1000) {
            sizeType = ImageSizeType.MEDIUM
        } else if (fileSize < 3000) {
            sizeType = ImageSizeType.LARGE
        } else {
            sizeType = ImageSizeType.EXTRA_LARGE
        }

        // save image to database
        const uploadImage = await this._prismaService.images.create({
            data: {
                authorId: author.userId,
                name: imageFile.filename,
                originalName: imageFile.originalname,
                sizeKb: fileSize,
                mimeType: imageFile.mimetype,
                sizeType: sizeType,
                width: 0,
                height: 0
            },
            select: {
                id: true,
                authorId: true,
                name: true,
                originalName: true,
                sizeKb: true,
                mimeType: true,
                sizeType: true,
                width: true,
                height: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true
            }
        })

        return { ...uploadImage, url: this.uploadedURL + uploadImage.name }
    }

    /**
     * Delete a post
     * @param id - The ID of the post
     * @returns The deleted post
     */
    async delete(id: string) {
        return this._prismaService.post.update({ data: { deletedAt: new Date() }, where: { id } })
    }

    /**
     * Restore a post
     * @param id - The ID of the post
     * @returns The restored post
     */
    async restore(id: string) {
        return this._prismaService.post.update({ data: { deletedAt: null }, where: { id } })
    }

    /**
     * Get a tag by its ID
     * @param tags - The list of tags
     * @param tagId - The ID of the tag
     * @returns The found tag
     */
    getTagById(tags, tagId) {
        for (const tag of tags) {
            if (tag.id === tagId) {
                return tag
            }
        }
        return null
    }
}
