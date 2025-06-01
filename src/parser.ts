import { DMMF } from '@prisma/generator-helper';

/**
 * 以前使用していたモデル関係の型定義
 * 注: 現在は直接DMMF.Modelを返すようになりました
 * @deprecated
 */
export interface RelationMethodInfo {
  name: string;
  type: 'hasMany' | 'manyToMany' | 'through';
  relatedModel: string;
  foreignKey?: string;
  pivotModel?: string;
  pivotRelatedField?: string;
}

export interface ParsedModel {
  model: string;
  relations: string[];
  fields: readonly DMMF.Field[];
  relationMethods: RelationMethodInfo[];
  relationMap: Record<string, string>;
}

/**
 * リレーションを持つモデルをフィルタリングする
 *
 * @param models Prismaのモデル定義
 * @returns リレーションを持つモデルのリスト
 */
export function parseRelations(models: DMMF.Model[]): ParsedModel[] {
  const relationModels = models.filter((m) =>
    m.fields.some((f) => f.kind === 'object'),
  );

  return relationModels.map((model) => {
    const relationFields = model.fields.filter((f) => f.kind === 'object');
    const relations = relationFields.map((f) => f.name);
    const relationMap: Record<string, string> = {};
    for (const f of relationFields) {
      relationMap[f.name] = f.type;
    }
    const relationMethods: RelationMethodInfo[] = [];

    for (const field of relationFields) {
      if (!field.isList) {
        continue;
      }
      const related = models.find((m) => m.name === field.type);
      if (!related) {
        continue;
      }

      const back = related.fields.find(
        (f) =>
          f.kind === 'object' &&
          f.type === model.name &&
          f.relationName === field.relationName,
      );
      if (
        back &&
        !back.isList &&
        back.relationFromFields &&
        back.relationFromFields.length > 0
      ) {
        relationMethods.push({
          name: field.name,
          type: 'hasMany',
          relatedModel: related.name,
          foreignKey: back.relationFromFields[0],
        });
        continue;
      }

      if (back && back.isList) {
        relationMethods.push({
          name: field.name,
          type: 'manyToMany',
          relatedModel: related.name,
        });
        continue;
      }

      const pivot = models.find((m) => {
        const hasSelf = m.fields.some(
          (pf) => pf.kind === 'object' && pf.type === model.name,
        );
        const hasRelated = m.fields.some(
          (pf) => pf.kind === 'object' && pf.type === related.name,
        );
        return hasSelf && hasRelated;
      });

      if (pivot) {
        const selfField = pivot.fields.find(
          (pf) => pf.kind === 'object' && pf.type === model.name,
        );
        const relatedField = pivot.fields.find(
          (pf) => pf.kind === 'object' && pf.type === related.name,
        );
        const foreignKey = selfField?.relationFromFields?.[0];
        const pivotRelatedField = relatedField?.name;
        if (foreignKey && pivotRelatedField) {
          relationMethods.push({
            name: field.name,
            type: 'through',
            relatedModel: related.name,
            foreignKey,
            pivotModel: pivot.name,
            pivotRelatedField,
          });
        }
      }
    }

    return {
      model: model.name,
      relations,
      fields: model.fields,
      relationMethods,
      relationMap,
    };
  });
}
