export interface RelationTree {
  [relation: string]: string;
}

export interface RelationTrees {
  [model: string]: RelationTree;
}

export function buildNestedInclude(
  rootModel: string,
  path: string,
  trees: RelationTrees,
): Record<string, unknown> {
  const parts = path.split('.').filter((p) => p);
  if (parts.length === 0) {
    throw new Error('Invalid relation path');
  }
  let currentModel = rootModel;
  const include: Record<string, unknown> = {};
  let current = include;
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    const nextModel = trees[currentModel]?.[part];
    if (!nextModel) {
      throw new Error(`Invalid relation path: ${parts.slice(0, i + 1).join('.')}`);
    }
    if (i === parts.length - 1) {
      current[part] = true;
    } else {
      const nested: Record<string, unknown> = {};
      current[part] = { include: nested };
      current = nested;
    }
    currentModel = nextModel;
  }
  return include;
}

export function mergeIncludes(
  base: Record<string, unknown>,
  addition: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(addition)) {
    const sourceVal = addition[key];
    if (!(key in result)) {
      result[key] = sourceVal;
      continue;
    }
    const targetVal = result[key];
    if (targetVal === true || sourceVal === true) {
      result[key] = true;
      continue;
    }
    const targetInclude = (targetVal as { include: Record<string, unknown> }).include ?? {};
    const sourceInclude = (sourceVal as { include: Record<string, unknown> }).include ?? {};
    result[key] = { include: mergeIncludes(targetInclude, sourceInclude) };
  }
  return result;
}
