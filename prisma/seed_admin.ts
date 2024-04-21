import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// npx prisma db seed

// Truncate the tables
async function truncate(prisma: PrismaClient) {
    await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=0`

    await prisma.$queryRawUnsafe('TRUNCATE TABLE tokens')
    await prisma.$queryRawUnsafe('TRUNCATE TABLE admins')

    await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=1`
}

// Create the default admin
const createDefaultAdmin = async () => {
    const admin = {
        firstName: 'admin',
        lastName: '',
        email: 'admin@mail.com',
        password: await bcrypt.hash('admin', 10)
    }

    await prisma.user.create({
        data: { ...admin, role: Role.ADMIN }
    })

    await prisma.admin.create({
        data: admin
    })
}

// Main function
async function main() {
    await truncate(prisma)

    await createDefaultAdmin()
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
