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

generated-helpers/ ディレクトリに UserHelper.ts や ProfileHelper.ts が自動生成されます。

## 使用例

```
import { UserHelper } from './generated-helpers/UserHelper';

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
  "generate": "yarn prisma generate",
  "seed": "ts-node prisma/seed.ts"
}
```

## 📄 ライセンス

MIT © 2025 shota-sakumoto

## 貢献

Pull Request、Issue 大歓迎です！

```
git clone https://github.com/sakumoto-shota/prisma-relation-helper-generator.git
```
