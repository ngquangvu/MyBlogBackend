import { Admin, PrismaClient, User } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// npx prisma db seed

async function truncate(prisma: PrismaClient) {
    await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=0`

    await prisma.$queryRawUnsafe('TRUNCATE TABLE tokens')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE users')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE admins')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE posts')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE comments')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE categories')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE tags')

    await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=1`
}

enum Role {
    USER = 'USER',
    AUTHOR = 'AUTHOR'
}

const categoryData = [
    {
        title: 'Cate 1',
        slug: 'slugc1',
        content: 'This is cate 1'
    },
    {
        title: 'Cate 2',
        slug: 'slugc2',
        content: 'This is cate 2'
    }
]

const tagData = [
    {
        title: 'Tag 1',
        slug: 'slugt1',
        content: 'This is tag 1'
    },
    {
        title: 'Tag 2',
        slug: 'slugt2',
        content: 'This is tag 2'
    }
]

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

const createCategories = async () => {
    categoryData.forEach(async (cate) => {
        await prisma.category.create({
            data: cate
        })
    })
}

const createTags = async () => {
    tagData.forEach(async (tag) => {
        await prisma.tag.create({
            data: tag
        })
    })
}

const createUserPost = async () => {
    await prisma.user.upsert({
        where: {
            email: 'author1@mail.com'
        },
        update: {},
        create: {
            email: 'author1@mail.com',
            firstName: 'A',
            lastName: 'Nguyen',
            role: Role.AUTHOR,
            password: '12345678',
            posts: {
                create: [
                    {
                        parentId: null,
                        title: 'Post title 1',
                        metaTitle: 'metaTitle1',
                        slug: 'slug1',
                        summary: 'Post summary 1',
                        content: 'Post content 1',
                        thumbnail: 'thumbnail.png',
                        url: 'https://example.com/blog/post1',
                        published: true
                    },
                    {
                        parentId: null,
                        title: 'Post title 2',
                        metaTitle: 'metaTitle2',
                        slug: 'slug2',
                        summary: 'Post summary 2',
                        content: 'Post content 2',
                        thumbnail: 'thumbnail.png',
                        url: 'https://example.com/blog/post2',
                        published: true
                    }
                ]
            }
        }
    })

    await prisma.user.upsert({
        where: {
            email: 'author2@mail.com'
        },
        update: {},
        create: {
            email: 'author2@mail.com',
            firstName: 'B',
            lastName: 'Nguyen',
            role: Role.AUTHOR,
            password: '12345678',
            posts: {
                create: [
                    {
                        parentId: null,
                        title: 'Post title 3',
                        metaTitle: 'metaTitle3',
                        slug: 'slug3',
                        summary: 'Post summary 3',
                        content: 'Post content 3',
                        thumbnail: 'thumbnail.png',
                        url: 'https://example.com/blog/post3',
                        published: true
                    }
                ]
            }
        }
    })
}

async function main() {
    await truncate(prisma)

    await createDefaultAdmin()

    await createCategories()

    await createTags()

    await createUserPost()
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
