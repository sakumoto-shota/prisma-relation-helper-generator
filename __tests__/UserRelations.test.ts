import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../src/prisma-client';
import { UserRelations } from '../dist/generated-helpers/UserRelations';

beforeAll(async () => {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('UserRelations', () => {
  it('returns posts for a user', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'RelationUser',
        posts: { create: [{ title: 'p1', content: 'c1' }] },
      },
      include: { posts: true },
    });
    const relations = new UserRelations(user);
    const posts = await relations.posts();
    expect(posts.length).toBe(1);
    expect(posts[0].title).toBe('p1');
  });
});
