import { Admin, Post, PrismaClient, User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { Faker } from '@faker-js/faker'
import { faker as faker_en } from '@faker-js/faker/locale/en_US'
import { faker as faker_ja } from '@faker-js/faker/locale/ja'

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

const randomArray = (min: number, max: number) => Array(Math.floor(Math.random() * (max - min + 1) + min))

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

const createUserPost = async (user: User): Promise<Post> => {
    return await prisma.post.create({
        data: {
            parentId: user.id,
            title: faker_en.company.name(),
            metaTitle: faker_en.company.buzzNoun(),
            slug: faker_en.company.buzzNoun(),
            summary: faker_en.lorem.paragraph(1),
            content: faker_en.lorem.paragraph(2),
            thumbnail: faker_en.image.url(),
            url: faker_en.internet.url(),
            published: true
        }
    })
}

async function main() {
    await truncate(prisma)

    await createDefaultAdmin()

    await createCategories()

    await createTags()

    const users: User[] = []
    const posts: Post[] = []

    for (const _ of randomArray(10, 10)) {
        const user = await createUser()
        users.push(user)

        const post = await createUserPost(user)
        posts.push(post)
    }
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
