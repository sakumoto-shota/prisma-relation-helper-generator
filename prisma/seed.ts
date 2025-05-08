import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // テストユーザー1
  const profile1 = await prisma.profile.create({
    data: {
      image: 'https://example.com/image1.jpg',
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

  // テストユーザー2（Taro）
  const profile2 = await prisma.profile.create({
    data: {
      image: 'https://example.com/image2.jpg',
      user: {
        create: {
          name: 'Taro'
        }
      }
    },
    include: {
      user: true
    }
  });

  // テストユーザー3（Taroを含む名前）
  const profile3 = await prisma.profile.create({
    data: {
      image: 'https://example.com/image3.jpg',
      user: {
        create: {
          name: 'Taro Yamada'
        }
      }
    },
    include: {
      user: true
    }
  });

  console.log('Seeded profiles:', { profile1, profile2, profile3 });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
