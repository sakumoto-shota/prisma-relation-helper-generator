import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { DMMF } from '@prisma/generator-helper';
import { parseRelations } from './parser';

/**
 * Prismaモデルからヘルパークラスを生成する
 *
 * @param models Prismaのモデル定義
 * @param outputPath 出力ディレクトリのパス
 */
export async function generate(
  models: DMMF.Model[],
  outputPath: string,
): Promise<void> {
  // リレーションを持つモデルだけを抽出
  // 注: parseRelations関数はDMMF.Model[]を返します
  const parsedModels = parseRelations(models);

  // テンプレートファイルの読み込み
  const templatePath = path.join(__dirname, 'templates/helper.ejs');
  const template = fs.readFileSync(templatePath, 'utf-8');

  // 各モデルに対してヘルパーファイルを生成
  for (const model of parsedModels) {
    // モデルのフィールドからリレーション情報を抽出
    const relations = model.fields
      .filter((f) => f.kind === 'object')
      .map((f) => f.name);

    // テンプレートをレンダリング
    const content = ejs.render(template, {
      model: { model: model.name, relations },
    });

    // ファイルに書き出し
    fs.writeFileSync(path.join(outputPath, `${model.name}Helper.ts`), content);
    console.log(`✅ ${model.name}Helper.ts を生成しました`);
  }
}
