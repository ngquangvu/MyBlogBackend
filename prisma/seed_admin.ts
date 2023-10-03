import { Admin, PrismaClient, User } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// npx prisma db seed

async function truncate(prisma: PrismaClient) {
    await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=0`

    await prisma.$queryRawUnsafe('TRUNCATE TABLE tokens')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE admins')

    await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=1`
}

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

async function main() {
    await truncate(prisma)

    await createDefaultAdmin()
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
