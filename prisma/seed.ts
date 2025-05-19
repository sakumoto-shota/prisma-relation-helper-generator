import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main(): Promise<void> {
  // ユーザー1
  const user1 = await prisma.user.create({
    data: {
      name: 'Taro',
      createdAt: new Date('2024-05-01T10:00:00Z'),
      isActive: true,
      profile: {
        create: {
          image: 'https://example.com/image1.jpg',
        },
      },
      posts: {
        create: [
          { title: 'Taro Post 1', content: 'Content 1' },
          { title: 'Taro Post 2', content: 'Content 2' },
        ],
      },
    },
    include: { profile: true, posts: true },
  });
  for (const post of user1.posts) {
    await prisma.thread.create({
      data: {
        title: `${post.title} - Thread 1`,
        postId: post.id,
      },
    });
  }

  // ユーザー2
  const user2 = await prisma.user.create({
    data: {
      name: 'Hanako',
      createdAt: new Date('2024-05-02T10:00:00Z'),
      isActive: false,
      profile: {
        create: {
          image: 'https://example.com/image2.jpg',
        },
      },
      posts: {
        create: [{ title: 'Hanako Post 1', content: 'Content 1' }],
      },
    },
    include: { profile: true, posts: true },
  });
  for (const post of user2.posts) {
    await prisma.thread.create({
      data: {
        title: `${post.title} - Thread 1`,
        postId: post.id,
      },
    });
  }

  // ユーザー3
  const user3 = await prisma.user.create({
    data: {
      name: 'Jiro',
      createdAt: new Date('2024-05-03T10:00:00Z'),
      isActive: false,
      profile: {
        create: {
          image: 'https://example.com/image3.jpg',
        },
      },
      posts: {
        create: [
          { title: 'Jiro Post 1', content: 'Content 1' },
          { title: 'Jiro Post 2', content: 'Content 2' },
          { title: 'Jiro Post 3', content: 'Content 3' },
        ],
      },
    },
    include: { profile: true, posts: true },
  });
  for (const post of user3.posts) {
    await prisma.thread.create({
      data: {
        title: `${post.title} - Thread 1`,
        postId: post.id,
      },
    });
  }

  console.log('Seed data created:', { user1, user2, user3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
