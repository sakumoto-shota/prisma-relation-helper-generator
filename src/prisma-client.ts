import { PrismaClient } from '@prisma/client';

/**
 * PrismaClientのシングルトンクラス
 * アプリケーション内で単一のPrismaClientインスタンスを管理します
 */
export class PrismaClientSingleton {
  private static instance: PrismaClient;

  /**
   * PrismaClientのインスタンスを取得します
   * 初回呼び出し時に新しいインスタンスを作成し、以降は同じインスタンスを返します
   * @returns 共有されたPrismaClientインスタンス
   */
  public static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient();
    }
    return PrismaClientSingleton.instance;
  }

  /**
   * PrismaClientをクリーンアップします
   * アプリケーション終了時などに呼び出してください
   */
  public static async disconnect(): Promise<void> {
    if (PrismaClientSingleton.instance) {
      await PrismaClientSingleton.instance.$disconnect();
    }
  }
}

// エクスポートする共有インスタンス
export const prisma = PrismaClientSingleton.getInstance();
