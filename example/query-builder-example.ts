import { UserHelper } from '../prisma/generated-helpers/UserHelper';
import { prisma } from '../src/prisma-client';

(async (): Promise<void> => {
  try {
    // 単一レコードの取得
    const user = await UserHelper.where({ name: 'Taro' }).first();
    console.log('Single user:', user);

    // 複数レコードの取得
    const users = await UserHelper.where({ name: { contains: 'Taro' } }).get();
    console.log('Multiple users:', users);

    // リレーションを含む取得
    const userWithProfile = await UserHelper.where({ name: 'Taro' }).first();
    console.log('User with profile:', userWithProfile?.profile);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
