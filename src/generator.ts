import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';

export async function generateHelpers(models: any[], outputPath: string) {
  await fs.mkdir(outputPath, { recursive: true });

  const template = await fs.readFile(
    path.join(__dirname, 'templates', 'helper.ejs'),
    'utf-8'
  );

  for (const model of models) {
    const content = ejs.render(template, { model });
    await fs.writeFile(
      path.join(outputPath, `${model.model}Helper.ts`),
      content
    );
  }
}
