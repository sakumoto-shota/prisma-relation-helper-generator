import * as path from 'path';
import * as fs from 'fs/promises';
import * as ejs from 'ejs';
import { ParsedModel } from './parser';

/**
 * Prismaモデルからヘルパークラスを生成する
 *
 * @param models Prismaのモデル定義
 * @param outputPath 出力ディレクトリのパス
 */
export async function generate(
  models: ParsedModel[],
  outputPath: string,
): Promise<void> {
  const helperPath = path.join(__dirname, 'templates/helper.ejs');
  const relationPath = path.join(__dirname, 'templates/relations.ejs');
  const helperTemplate = await fs.readFile(helperPath, 'utf-8');
  const relationTemplate = await fs.readFile(relationPath, 'utf-8');

  for (const model of models) {
    const helperContent = ejs.render(helperTemplate, { model });
    await fs.writeFile(
      path.join(outputPath, `${model.model}Helper.ts`),
      helperContent,
    );

    if (model.relationMethods.length > 0) {
      const relationContent = ejs.render(relationTemplate, { model });
      await fs.writeFile(
        path.join(outputPath, `${model.model}Relations.ts`),
        relationContent,
      );
    }
  }
}
