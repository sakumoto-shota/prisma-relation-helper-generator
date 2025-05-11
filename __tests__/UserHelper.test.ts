import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { UserHelper } from '../prisma/generated-helpers/UserHelper';
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
});
