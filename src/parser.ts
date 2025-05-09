import { DMMF } from '@prisma/generator-helper';

/**
 * 以前使用していたモデル関係の型定義
 * 注: 現在は直接DMMF.Modelを返すようになりました
 * @deprecated
 */
export interface ModelRelation {
  model: string;
  relations: string[];
}

/**
 * リレーションを持つモデルをフィルタリングする
 *
 * @param models Prismaのモデル定義
 * @returns リレーションを持つモデルのリスト
 */
export function parseRelations(models: DMMF.Model[]): DMMF.Model[] {
  return models.filter((model) =>
    model.fields.some((f) => f.kind === 'object'),
  );
}
