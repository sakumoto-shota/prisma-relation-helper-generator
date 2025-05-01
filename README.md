## リポジトリ情報

リポジトリ名：​prisma-relation-helper-generator

GitHub URL：​https://github.com/sakumoto-shota/prisma-relation-helper-generator

概要：​Prisma のスキーマファイル（schema.prisma）から、各モデルの@relation 情報を解析し、リレーションアクセサヘルパー関数を自動生成する Generator です。

## リポジトリをクローン

```
yarn install
```

## ビルド

```
yarn build
```

## Prisma プロジェクトへの組み込み

```
generator relationHelper {
  provider = "path:../prisma-relation-helper-generator/dist/index.js"
  output   = "../generated-helpers"
}
```

## ヘルパー関数の生成

```
npx prisma generate
```

## 使用例

```
import { UserHelper } from '../generated-helpers/UserHelper';

(async () => {
  const profile = await UserHelper.profileById(1);
  console.log(profile?.image);
})();
```
