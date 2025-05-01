export interface ModelRelation {
  model: string;
  relations: string[];
}

export function parseRelations(models: any[]): ModelRelation[] {
  return models.map(model => ({
    model: model.name,
    relations: model.fields
      .filter((f: any) => f.relationName)
      .map((f: any) => f.name)
  })).filter(m => m.relations.length > 0);
}