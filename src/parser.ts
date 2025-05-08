import { DMMF } from '@prisma/generator-helper';

export interface ModelRelation {
  model: string;
  relations: string[];
}

export function parseRelations(models: DMMF.Model[]): DMMF.Model[] {
  return models.filter((model) =>
    model.fields.some((f) => f.kind === 'object'),
  );
}
