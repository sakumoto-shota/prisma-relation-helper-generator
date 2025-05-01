import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Profile を先に作成（user に紐づける）
  const profile = await prisma.profile.create({
    data: {
      image: 'https://example.com/image.jpg',
      user: {
        create: {
          name: 'テストユーザー'
        }
      }
    },
    include: {
      user: true
    }
  });

  console.log('Seeded profile:', profile);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
