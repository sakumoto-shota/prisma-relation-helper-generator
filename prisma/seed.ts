import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main(): Promise<void> {
  // 既存のデータを削除
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // ユーザー1（アクティブ、プロフィールあり、投稿あり）
  const user1 = await prisma.user.create({
    data: {
      name: 'Taro',
      createdAt: new Date('2024-05-01T10:00:00Z'),
      isActive: true,
      profile: {
        create: {
          image: 'https://example.com/taro.jpg',
        },
      },
      posts: {
        create: [
          { title: 'Taroの投稿1', content: 'これはTaroの最初の投稿です' },
          { title: 'Taroの投稿2', content: 'これはTaroの2番目の投稿です' },
          { title: 'Taroの投稿3', content: 'これはTaroの3番目の投稿です' },
        ],
      },
    },
    include: { profile: true, posts: true },
  });

  // ユーザー2（非アクティブ、プロフィールあり、投稿なし）
  const user2 = await prisma.user.create({
    data: {
      name: 'Hanako',
      createdAt: new Date('2024-05-02T10:00:00Z'),
      isActive: false,
      profile: {
        create: {
          image: 'https://example.com/hanako.jpg',
        },
      },
    },
    include: { profile: true, posts: true },
  });

  // ユーザー3（アクティブ、プロフィールなし、投稿あり）
  const user3 = await prisma.user.create({
    data: {
      name: 'Jiro',
      createdAt: new Date('2024-05-03T10:00:00Z'),
      isActive: true,
      posts: {
        create: [
          { title: 'Jiroの投稿1', content: 'これはJiroの最初の投稿です' },
          { title: 'Jiroの投稿2', content: 'これはJiroの2番目の投稿です' },
        ],
      },
    },
    include: { profile: true, posts: true },
  });

  // ユーザー4（削除済み、プロフィールあり、投稿あり）
  const user4 = await prisma.user.create({
    data: {
      name: 'Yuki',
      createdAt: new Date('2024-05-04T10:00:00Z'),
      isActive: true,
      deletedAt: new Date('2024-05-05T10:00:00Z'),
      profile: {
        create: {
          image: 'https://example.com/yuki.jpg',
        },
      },
      posts: {
        create: [
          { title: 'Yukiの投稿1', content: 'これはYukiの最初の投稿です' },
        ],
      },
    },
    include: { profile: true, posts: true },
  });

  console.log('Seed data created:');
  console.log('User1 (Taro):', {
    id: user1.id,
    name: user1.name,
    postsCount: user1.posts.length,
    hasProfile: !!user1.profile,
  });
  console.log('User2 (Hanako):', {
    id: user2.id,
    name: user2.name,
    postsCount: user2.posts.length,
    hasProfile: !!user2.profile,
  });
  console.log('User3 (Jiro):', {
    id: user3.id,
    name: user3.name,
    postsCount: user3.posts.length,
    hasProfile: !!user3.profile,
  });
  console.log('User4 (Yuki - Deleted):', {
    id: user4.id,
    name: user4.name,
    postsCount: user4.posts.length,
    hasProfile: !!user4.profile,
    deletedAt: user4.deletedAt,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
