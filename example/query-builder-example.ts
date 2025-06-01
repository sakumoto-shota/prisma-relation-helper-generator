import { prisma } from '../src/prisma-client';
import { UserHelper as ExtendedUserHelper } from './extended/UserHelper';
import { UserRelations } from '../dist/generated-helpers/UserRelations';

(async (): Promise<void> => {
  try {
    // 単一レコードの取得
    const user = await ExtendedUserHelper.where({ name: 'Taro' }).first();
    console.log('Single user:', user);

    // 複数レコードの取得
    const users = await ExtendedUserHelper.where({
      name: { contains: 'a' },
    }).get();
    console.log('Multiple users:', users);

    // リレーションを含む取得
    const userAndProfile = await ExtendedUserHelper.where({
      name: 'Taro',
    }).first();
    console.log('User and profile:', userAndProfile?.profile);

    // リレーションを含むeager loading取得
    const userWithProfile = await ExtendedUserHelper.with('profile')
      .where({ name: 'Taro' })
      .first();
    console.log('User with profile:', userWithProfile?.profile);

    // ネストしたリレーションを含むeager loading取得
    const userWithProfileImage = await ExtendedUserHelper.with('profile.image')
      .where({ name: 'Taro' })
      .first();
    console.log('User with profile image:', userWithProfileImage?.profile?.image);

    // UserRelationsの使用例
    if (userWithProfile) {
      const relations = new UserRelations(userWithProfile);
      const posts = await relations.posts();
      console.log('Posts count:', posts.length);
      console.log('Posts:', posts);
    }

    // createdAt昇順
    const usersAsc = await ExtendedUserHelper.where({})
      .orderBy('createdAt', 'asc')
      .get();
    console.log(
      'Users (createdAt asc):',
      usersAsc.map((u) => ({ name: u.name, createdAt: u.createdAt })),
    );

    // createdAt降順
    const usersDesc = await ExtendedUserHelper.where({})
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

    // --- CRUD操作の例 ---
    // 追加
    const createdUser = await ExtendedUserHelper.create({ name: 'NewUser' });
    console.log('Created user:', createdUser);

    // 更新
    const updatedUser = await ExtendedUserHelper.update(createdUser.id, {
      name: 'UpdatedUser',
    });
    console.log('Updated user:', updatedUser);

    // 削除
    const deletedUser = await ExtendedUserHelper.delete(createdUser.id);
    console.log('Deleted user:', deletedUser);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
