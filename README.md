# prisma-relation-helper-generator

Prismaの@relation情報から型安全なリレーションヘルパー関数を自動生成するGenerator

## インストール

```bash
git clone https://github.com/sakumoto-shota/prisma-relation-helper-generator.git
cd prisma-relation-helper-generator
yarn install
yarn build
```

## Prismaスキーマ設定

```prisma
generator relationHelper {
  provider = "path:./dist/index.js"
  output   = "./generated-helpers"
}
```

## ヘルパー生成

```bash
yarn prisma generate
```

## 使用例

```typescript
import { UserHelper } from './generated-helpers/UserHelper';

const profile = await UserHelper.profileById(1);
console.log(profile?.image);
```