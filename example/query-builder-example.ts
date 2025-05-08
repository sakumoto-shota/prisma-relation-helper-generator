import { UserHelper } from '../prisma/generated-helpers/UserHelper';
import { PrismaClient } from '@prisma/client';

// ヘルパーとの共通インスタンスを使用するためのシングルトンクラス
// 注: 実際のアプリケーションでは、このPrismaClientSingletonクラスを共通モジュールに定義すると良いでしょう
class PrismaClientSingleton {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient();
    }
    return PrismaClientSingleton.instance;
  }
}

// 既存のシングルトンインスタンスを取得
const prisma = PrismaClientSingleton.getInstance();

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
