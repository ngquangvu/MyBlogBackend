import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function truncate(prisma: PrismaClient) {
  await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=0`;

  await prisma.$queryRawUnsafe('TRUNCATE TABLE users');
  await prisma.$queryRawUnsafe('TRUNCATE TABLE profiles');
  await prisma.$queryRawUnsafe('TRUNCATE TABLE posts');
  await prisma.$queryRawUnsafe('TRUNCATE TABLE categories');
  await prisma.$queryRawUnsafe('TRUNCATE TABLE tags');

  await prisma.$queryRaw`SET FOREIGN_KEY_CHECKS=1`;
}

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      posts: {
        create: {
          title: 'Check out Prisma with Next.js',
          content: 'https://www.prisma.io/nextjs',
          published: true,
        },
      },
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma',
            published: true,
          },
          {
            title: 'Follow Nexus on Twitter',
            content: 'https://twitter.com/nexusgql',
            published: true,
          },
        ],
      },
    },
  });
  console.log({ alice, bob });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
