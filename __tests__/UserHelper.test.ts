import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from 'vitest';
import { UserHelper } from '../dist/generated-helpers/UserHelper';
import { prisma } from '../src/prisma-client';

beforeAll(async () => {
  // 依存関係のある順に削除
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(() => {
  // 各テスト前にデフォルト値にリセット
  UserHelper.enableSoftDelete = false;
});

afterEach(() => {
  // テスト後もfalseに戻す
  UserHelper.enableSoftDelete = false;
});

describe('UserHelper', () => {
  it('should create a user', async () => {
    const user = await UserHelper.create({ name: 'TestUser' });
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('TestUser');
  });

  it('should find a user by id', async () => {
    const created = await UserHelper.create({ name: 'FindMe' });
    const found = await UserHelper.findById(created.id);
    expect(found?.name).toBe('FindMe');
  });

  it('should soft delete a user if enableSoftDelete is true', async () => {
    UserHelper.enableSoftDelete = true;
    const user = await UserHelper.create({ name: 'SoftDeleteUser' });
    await UserHelper.delete(user.id);
    const deleted = await UserHelper.findById(user.id);
    expect(deleted?.deletedAt).not.toBeNull();
  });

  it('should physically delete a user if enableSoftDelete is false', async () => {
    UserHelper.enableSoftDelete = false;
    const user = await UserHelper.create({ name: 'PhysicalDeleteUser' });
    await UserHelper.delete(user.id);
    const deleted = await UserHelper.findById(user.id);
    expect(deleted).toBeNull();
  });

  it('should eager load posts and threads', async () => {
    const user = await UserHelper.create({
      name: 'ThreadUser',
      posts: {
        create: [{ title: 'p1', content: 'c1' }],
      },
    });
    const post = await prisma.post.findFirst({ where: { userId: user.id } });
    if (post) {
      await prisma.thread.create({
        data: { title: 't1', postId: post.id },
      });
    }
    const loaded = await UserHelper.with(['posts', 'posts.threads']).findById(user.id);
    expect(loaded?.posts[0]?.threads.length).toBeGreaterThan(0);
  });
});
