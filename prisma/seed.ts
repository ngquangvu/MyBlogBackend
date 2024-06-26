import { Admin, Category, Post, PrismaClient, Tag, User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { Faker } from '@faker-js/faker'
import { faker as faker_en } from '@faker-js/faker/locale/en_US'
import { faker as faker_ja } from '@faker-js/faker/locale/ja'

const prisma = new PrismaClient()

// npx prisma db seed

// Truncate the tables
async function truncate(prisma: PrismaClient) {
    await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=0`

    await prisma.$queryRawUnsafe('TRUNCATE TABLE tokens')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE users')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE admins')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE posts')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE comments')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE post_categories')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE post_tags')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE categories')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE tags')

    await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=1`
}
// Generate random positive integer
const randomPositiveInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

// Generate random array
const randomArray = (min: number, max: number) => Array(Math.floor(Math.random() * (max - min + 1) + min))

// Dummy data
const categoryData = [
    {
        title: 'Cate 1',
        slug: 'slugc1',
        image: 'nestjs_logo.svg',
        content: 'This is cate 1'
    },
    {
        title: 'Cate 2',
        slug: 'slugc2',
        image: 'nestjs_logo.svg',
        content: 'This is cate 2'
    },
    {
        title: 'Cate 3',
        slug: 'slugc3',
        image: 'nestjs_logo.svg',
        content: 'This is cate 3'
    }
]

const tagData = [
    {
        title: 'Tag 1',
        slug: 'slugt1',
        image: 'nestjs_logo.svg',
        content: 'This is tag 1'
    },
    {
        title: 'Tag 2',
        slug: 'slugt2',
        image: 'nestjs_logo.svg',
        content: 'This is tag 2'
    },
    {
        title: 'Tag 3',
        slug: 'slugt3',
        image: 'nestjs_logo.svg',
        content: 'This is tag 3'
    }
]

// Create the default admin
const createDefaultAdmin = async (): Promise<Admin> => {
    return await prisma.admin.create({
        data: {
            firstName: 'admin',
            lastName: '',
            email: 'admin@mail.com',
            password: await bcrypt.hash('admin', 10)
        }
    })
}

// Create categories
const createCategories = async (): Promise<Category[]> => {
    const cates: Category[] = []
    categoryData.forEach(async (cateItem) => {
        const cate = await prisma.category.create({
            data: cateItem
        })
        cates.push(cate)
    })

    return cates
}

// Create tags
const createTags = async (): Promise<Tag[]> => {
    const tags: Tag[] = []
    tagData.forEach(async (tagItem) => {
        const tag = await prisma.tag.create({
            data: tagItem
        })
        tags.push(tag)
    })

    return tags
}

// Create a user
const createUser = async (): Promise<User> => {
    return await prisma.user.create({
        data: {
            firstName: faker_en.name.firstName(),
            lastName: faker_en.name.lastName(),
            email: faker_en.helpers.unique(faker_en.internet.email),
            password: await bcrypt.hash('12345678', 10)
        }
    })
}

// Create a post
const createUserPost = async (user: User): Promise<Post> => {
    return await prisma.post.create({
        data: {
            authorId: user.id,
            title: faker_en.company.name(),
            metaTitle: faker_en.company.buzzNoun(),
            slug: faker_en.company.buzzNoun(),
            summary: faker_en.lorem.paragraph(1),
            content: faker_en.lorem.paragraph(2),
            thumbnail: 'nestjs_logo.png',
            published: true,
            key: Math.random().toString(36).substring(2, 8)
        }
    })
}

// Create a post category
const createPostCate = async (post: Post, cateId: number) => {
    await prisma.postCategory.create({
        data: {
            postId: post.id,
            categoryId: cateId
        }
    })
}

// Create a post tag
const createPostTag = async (post: Post, tagId: number) => {
    await prisma.postTag.create({
        data: {
            postId: post.id,
            tagId: tagId
        }
    })
}

// Create categories and tags
const createCateTag = async () => {
    await createCategories()
    await createTags()
}

// Main function
async function main() {
    await truncate(prisma)

    await createDefaultAdmin()

    const users: User[] = []

    // Create categories, tags, users, posts, post categories, and post tags
    await createCateTag().then(async () => {
        for (const _ of randomArray(10, 10)) {
            const user = await createUser()
            users.push(user)

            const post = await createUserPost(user)

            categoryData.forEach(async (_, index) => {
                if (randomPositiveInteger(1, 2) % 2 === 1) {
                    await createPostCate(post, index + 1)
                }
            })

            tagData.forEach(async (_, index) => {
                if (randomPositiveInteger(1, 2) % 2 === 1) {
                    await createPostTag(post, index + 1)
                }
            })
        }
    })
}

// Run the main function
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
