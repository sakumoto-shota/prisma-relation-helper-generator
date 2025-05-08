import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { DMMF } from '@prisma/generator-helper';
import { parseRelations } from './parser';

export async function generate(
  models: DMMF.Model[],
  outputPath: string,
): Promise<void> {
  const parsedModels = parseRelations(models);

  // テンプレートファイルの読み込み
  const templatePath = path.join(__dirname, 'templates/helper.ejs');
  const template = fs.readFileSync(templatePath, 'utf-8');

  // 各モデルに対してヘルパーファイルを生成
  for (const model of parsedModels) {
    const relations = model.fields
      .filter((f) => f.kind === 'object')
      .map((f) => f.name);
    const content = ejs.render(template, {
      model: { model: model.name, relations },
    });
    fs.writeFileSync(path.join(outputPath, `${model.name}Helper.ts`), content);
    console.log(`✅ ${model.name}Helper.ts を生成しました`);
  }
}
