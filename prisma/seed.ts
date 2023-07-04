import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// npx prisma db seed

async function truncate(prisma: PrismaClient) {
    await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=0`

    await prisma.$queryRawUnsafe('TRUNCATE TABLE users')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE posts')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE post_comments')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE categories')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE tags')

    await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=1`
}

enum Role {
    USER,
    AUTHOR,
    ADMIN
}

const userData = [
    {
        id: '1',
        firstName: 'Vu',
        lastName: 'Nguyen',
        email: 'email@gmail.com',
        role: Role.ADMIN,
        password: '12345678'
    },
    {
        id: '2',
        firstName: 'Van',
        lastName: 'Nguyen',
        email: 'email2@gmail.com',
        role: Role.USER,
        password: '12345678'
    }
]

const categoryData = [
    {
        title: 'Cate 1',
        content: 'This is cate 1'
    },
    {
        title: 'Cate 2',
        content: 'This is cate 2'
    }
]

const tagData = [
    {
        title: 'Tag 1',
        content: 'This is tag 1'
    },
    {
        title: 'Tag 2',
        content: 'This is tag 2'
    }
]

const postData = [
    {
        authorId: '1',
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
        authorId: '2',
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

async function main() {}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
