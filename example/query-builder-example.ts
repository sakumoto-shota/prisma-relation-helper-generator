import { UserHelper } from '../prisma/generated-helpers/UserHelper';
import { prisma } from '../src/prisma-client';
import { UserHelper as ExtendedUserHelper } from './extended/UserHelper';

(async (): Promise<void> => {
  try {
    // 単一レコードの取得
    const user = await UserHelper.where({ name: 'Taro' }).first();
    console.log('Single user:', user);

    // 複数レコードの取得
    const users = await UserHelper.where({ name: { contains: 'Taro' } }).get();
    console.log('Multiple users:', users);

    // リレーションを含む取得
    const userAndProfile = await UserHelper.where({ name: 'Taro' }).first();
    console.log('User and profile:', userAndProfile?.profile);

    // リレーションを含むeager loading取得
    const userWithProfile = await UserHelper.with('profile')
      .where({ name: 'Taro' })
      .first();
    console.log('User with profile:', userWithProfile?.profile);

    // createdAt昇順
    const usersAsc = await UserHelper.where({})
      .orderBy('createdAt', 'asc')
      .get();
    console.log(
      'Users (createdAt asc):',
      usersAsc.map((u) => ({ name: u.name, createdAt: u.createdAt })),
    );

    // createdAt降順
    const usersDesc = await UserHelper.where({})
      .orderBy('createdAt', 'desc')
      .get();
    console.log(
      'Users (createdAt desc):',
      usersDesc.map((u) => ({ name: u.name, createdAt: u.createdAt })),
    );

    // isActive: true のユーザーのみ取得
    const activeUsers = await ExtendedUserHelper.active().get();
    console.log(
      'Active users:',
      activeUsers.map((u) => ({ name: u.name, isActive: u.isActive })),
    );
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
