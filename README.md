# Prisma Relation Helper Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Prisma Relation Helper Generator** は、Prisma のモデルから Eloquent (Laravel) 風のヘルパーを自動生成する Prisma Generator です。  
リレーション情報の取得や、`findById` メソッドなどを自動作成します。

---

## ✨ 特徴

- Prisma モデルのリレーションを自動解析
- `ModelHelper.findById(id)` 形式のヘルパーメソッドを自動生成
- テンプレート（EJS）で自由にカスタマイズ可能
- TypeScript 対応

---

## 📦 インストール

```bash
yarn add -D prisma-relation-helper-generator
※ 現在はローカル開発中。npm パブリッシュ後、正式版をインストール可能になります。
```

## 📝 Prisma schema.prisma 設定例

```
generator client {
  provider = "prisma-client-js"
}

generator relationHelper {
  provider = "./dist/index.js"
  output   = "./generated-helpers"
}

model User {
  id     Int     @id @default(autoincrement())
  name   String
  profile Profile?
}

model Profile {
  id      Int    @id @default(autoincrement())
  image   String
  user    User   @relation(fields: [userId], references: [id])
  userId  Int    @unique
}
```

## 🔧 ビルドとヘルパー生成

### ビルド（Generator の TypeScript コードを JavaScript に変換）

```
yarn build
```

### ヘルパーコード生成（Prisma generate）

```
yarn prisma generate
```

./prisma/generated-helpers/ ディレクトリに UserHelper.ts や ProfileHelper.ts が自動生成されます。

## 使用例

```
import { UserHelper } from '../prisma/generated-helpers/UserHelper';

(async () => {
  const user = await UserHelper.findById(1);
  console.log(user?.profile?.image);
})();
```

## シードデータ（オプション）

```
"scripts": {
  "seed": "ts-node prisma/seed.ts"
}
```

## 開発用スクリプト

```
"scripts": {
  "clean": "rm -rf dist generated-helpers",
  "build": "yarn clean && tsc && cp -R src/templates dist/templates && node ./add-shebang.js",
  "generate": "yarn build && yarn prisma generate && yarn lint:fix",
  "seed": "ts-node prisma/seed.ts",
  "lint": "eslint . --ext .ts",
  "lint:fix": "eslint . --ext .ts --fix"
}
```

## 🚦 CI/CD

このプロジェクトではGitHub Actionsを使用して以下の自動チェックを行っています：

- ESLintによるコードの品質チェック
- ビルドとPrisma生成のテスト
- 生成されたファイルのフォーマットチェック

PR作成時に自動的にこれらのチェックが実行されます。

## 👥 コントリビューション

コントリビューション大歓迎です！以下のガイドラインを参考にしてください：

1. リポジトリをフォークし、機能ブランチを作成します
2. コードを修正し、必要なテストを追加します
3. `yarn lint`を実行してコードスタイルを確認します
4. `yarn generate`を実行して、生成されたファイルが正しくフォーマットされていることを確認します
5. 変更をコミットし、PRを作成します

```
git clone https://github.com/sakumoto-shota/prisma-relation-helper-generator.git
cd prisma-relation-helper-generator
yarn install
```

## 📄 ライセンス

MIT © 2025 shota-sakumoto
