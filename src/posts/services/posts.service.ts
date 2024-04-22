import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/service/prisma.service'
import { PostDto, UpdatePostDto } from '../dtos'
import { ImageSizeType, Prisma } from '@prisma/client'
import { PostPaginationQueryDto } from 'src/common/dtos/post-pagination-query.dto'
import { TagsService } from 'src/tags/services'
import { unlinkFile } from 'src/utils'
import { CategoriesService } from 'src/categories/services'

@Injectable()
export class PostService {
    constructor(
        private readonly _prismaService: PrismaService,
        private readonly _tagService: TagsService,
        private readonly _cateService: CategoriesService
    ) {}
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
            key: true,
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
            key: true,
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

        // Get all categories
        const cates = await this._cateService.getAll()

        // Add additional data to the post
        return {
            ...post,
            thumbnail: post?.thumbnail ? this.uploadedURL + post.thumbnail : null,
            postTags: post.postTags.map((postTag) => this.getTagById(tags.data, postTag.tagId)),
            postCategories: post.postCategories.map((postCate) => this.getCateById(cates.data, postCate.categoryId))
        }
    }

    /**
     * Find a post by its title key
     * @param id - The ID of the post
     * @returns The found post
     */
    async findTitleKey(titleKey: string) {
        // Get the key from title key (title-key) format which is the last part of the string
        const key = titleKey.split('-').pop()

        // Find the post by key
        const post = await this._prismaService.post.findFirst({
            where: {
                key
            },
            ...this._select
        })

        // Get all tags
        const tags = await this._tagService.getAll()

        // Get all post tags
        const postTags = post?.postTags
            ? post?.postTags.map((postTag) => this.getTagById(tags.data, postTag.tagId))
            : []

        // Add additional data to the post
        return post
            ? {
                  ...post,
                  thumbnail: post?.thumbnail ? this.uploadedURL + post.thumbnail : null,
                  postTags
              }
            : null
    }

    /**
     * Find all posts
     * @param postPaginationQuery - The query parameters for pagination
     * @param byAdmin - If the request is made by an admin
     * @returns The list of posts
     */
    async findAll(postPaginationQuery: PostPaginationQueryDto, byAdmin = false) {
        const { page = 1, limit = 10, search = undefined, cate = '', tag = '', sort = '' } = postPaginationQuery

        const or = search
            ? {
                  OR: [
                      { title: { contains: search } },
                      { summary: { contains: search } },
                      { content: { contains: search } }
                  ]
              }
            : {}

        // Get the tag ID
        const tagObj = await this._tagService.findSlug(tag)
        const tagId = tagObj ? tagObj.id : tag === '' ? null : 0
        const postTagsCondition = tagId ? { some: { tagId: tagId } } : tagId === null ? {} : { some: { tagId: 0 } }

        // Get the category ID
        const cateObj = await this._cateService.findSlug(cate)
        const cateId = cateObj ? cateObj.id : cate === '' ? null : 0
        const postCatesCondition = cateId
            ? { some: { categoryId: cateId } }
            : cateId === null
            ? {}
            : { some: { categoryId: 0 } }

        // Get the total count of posts and the list of posts
        const [totalCount, data] = await Promise.all([
            this._prismaService.post.count({
                where: {
                    ...or,
                    postTags: byAdmin ? { every: { tagId: undefined } } : postTagsCondition,
                    postCategories: byAdmin ? { every: { categoryId: undefined } } : postCatesCondition,
                    deletedAt: byAdmin ? undefined : null
                }
            }),
            this._prismaService.post.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    ...or,
                    postTags: byAdmin ? { every: { tagId: undefined } } : postTagsCondition,
                    postCategories: byAdmin ? { every: { categoryId: undefined } } : postCatesCondition,
                    deletedAt: byAdmin ? undefined : null
                },
                // Sort by latest, relevant, top
                orderBy:
                    sort === 'latest'
                        ? { createdAt: Prisma.SortOrder.desc }
                        : sort === 'relevant'
                        ? {
                              postTags: {
                                  _count: Prisma.SortOrder.desc
                              }
                          }
                        : sort === 'top'
                        ? { content: Prisma.SortOrder.desc }
                        : { updatedAt: Prisma.SortOrder.desc },
                select: byAdmin ? this._selectAdmin.select : this._select.select
            })
        ])

        // Get all tags
        const tags = await this._tagService.getAll()

        // Get all categories
        const cates = await this._cateService.getAll()

        return {
            data: data.map((post) => {
                return {
                    ...post,
                    thumbnail: post?.thumbnail ? this.uploadedURL + post.thumbnail : null,
                    postTags: post.postTags.map((postTag) => this.getTagById(tags.data, postTag.tagId)),
                    postCategories: post.postCategories.map((postCate) =>
                        this.getCateById(cates.data, postCate.categoryId)
                    )
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
        // Get the tag IDs array
        const tagIds = createData.tagIds
        const tagIdsArray = tagIds.split(',').map((tagId) => {
            if (tagId && !isNaN(parseInt(tagId))) {
                return { tagId: parseInt(tagId) }
            }
        })

        // Get the category IDs array
        const cateIds = createData.cateIds
        const cateIdsArray = cateIds.split(',').map((cateId) => {
            if (cateId && !isNaN(parseInt(cateId))) {
                return { categoryId: parseInt(cateId) }
            }
        })

        // Remove the tagIds from the createData (not needed for creating the post)
        delete createData.tagIds
        // Remove the cateIds from the createData (not needed for creating the post)
        delete createData.cateIds

        // Create random key length = 6 with alphanumeric characters for the post
        const key = Math.random().toString(36).substring(2, 8)

        // Create the post
        return await this._prismaService.post.create({
            data: {
                ...createData,
                thumbnail: thumbnailFile ? thumbnailFile.filename : undefined,
                postTags: {
                    create: tagIdsArray
                },
                postCategories: {
                    create: cateIdsArray
                },
                key
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
        // Get the tag IDs array
        const tagIds = updateData.tagIds
        const tagIdsArray = tagIds.split(',').map((tagId) => {
            if (tagId && !isNaN(parseInt(tagId))) {
                return { tagId: parseInt(tagId) }
            }
        })

        // Get the category IDs array
        const cateIds = updateData.cateIds
        const cateIdsArray = cateIds.split(',').map((cateId) => {
            if (cateId && !isNaN(parseInt(cateId))) {
                return { categoryId: parseInt(cateId) }
            }
        })

        // If the thumbnail file is provided, delete the old thumbnail file
        if (thumbnailFile) {
            const post = await this.findOne(id)
            if (post && post.thumbnail) {
                unlinkFile(process.env.UPLOADED_FILES_PATH + '/' + post.thumbnail)
            }
        }

        // Remove the tagIds from the updateData (not needed for creating the post)
        delete updateData.tagIds
        // Remove the cateIds from the updateData (not needed for creating the post)
        delete updateData.cateIds

        // If tags is not null, delete all post tags
        if (tagIds) {
            await this._prismaService.postTag.deleteMany({
                where: { postId: id }
            })
        }

        // If cates is not null, delete all post cates
        if (cateIds) {
            await this._prismaService.postCategory.deleteMany({
                where: { postId: id }
            })
        }

        // Update the post
        return await this._prismaService.post.update({
            where: { id },
            data: {
                ...updateData,
                thumbnail: thumbnailFile ? thumbnailFile.filename : undefined,
                postTags: {
                    create: tagIdsArray
                },
                postCategories: {
                    create: cateIdsArray
                }
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
    private getTagById(tags, tagId) {
        for (const tag of tags) {
            if (tag.id === tagId) {
                return tag
            }
        }
        return null
    }

    /**
     * Get a cate by its ID
     * @param cates - The list of cates
     * @param cateId - The ID of the cate
     * @returns The found cate
     */
    private getCateById(cates, cateId) {
        for (const cate of cates) {
            if (cate.id === cateId) {
                return cate
            }
        }
        return null
    }
}
