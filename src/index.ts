import { generatorHandler } from '@prisma/generator-helper';
import type { GeneratorOptions } from '@prisma/generator-helper';
import { parseRelations } from './parser';
import { generateHelpers } from './generator';

generatorHandler({
  onManifest() {
    return {
      defaultOutput: './generated-helpers',
      prettyName: 'Prisma Relation Helper Generator',
    };
  },
  async onGenerate(options: GeneratorOptions) {
    const models = parseRelations([...options.dmmf.datamodel.models]);

    const outputPath = options.generator.output?.value || './generated-helpers';

    await generateHelpers(models, outputPath);
  },
});
