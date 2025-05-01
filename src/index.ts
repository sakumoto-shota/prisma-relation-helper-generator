import { generatorHandler } from '@prisma/generator-helper';
import { parseRelations } from './parser';
import { generateHelpers } from './generator';

generatorHandler({
  onManifest() {
    return {
      defaultOutput: './generated-helpers',
      prettyName: 'Prisma Relation Helper Generator'
    };
  },
  async onGenerate(options) {
    const models = parseRelations(options.dmmf.datamodel.models);
    await generateHelpers(models, options.generator.output!);
  }
});
