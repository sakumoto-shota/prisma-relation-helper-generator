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
- **型安全なリレーション事前読み込み**
- **orderByによる型安全なソートチェーンが可能（例：orderBy('createdAt', 'desc')）**
- **example配下でUserHelper/QueryBuilderを拡張し、active()などのカスタムクエリスコープを追加可能**
- **withを使わなくても、全リレーションが自動でeager loadされます（自動eager load化）**
- 例：
- const user = await UserHelper.where({ name: 'Taro' }).first();
- // user.profile や user.posts など全リレーションが自動で取得されます
- // with('profile')を使うとprofileのみeager loadされます

---

## 🆕 論理削除（soft delete）・CRUD強化

- Prismaモデルに `deletedAt` フィールドを追加することで論理削除（soft delete）に自動対応
- 生成されるHelper/QueryBuilderの `delete` メソッドで `enableSoftDelete`/`softDelete` フラグに応じて論理削除・物理削除を自動切り替え
- `UserHelper` などのヘルパーオブジェクトに `enableSoftDelete` プロパティを追加し、`UserHelper.enableSoftDelete = true` で論理削除を有効化可能
- example/extended/UserHelper.ts で `enableSoftDelete: true` をデフォルト有効化した拡張例を提供
- テンプレート（helper.ejs）でUserHelper/QueryBuilderごとに適切なフラグ判定を行うよう分岐
- generator.tsでテンプレートに `fields` を渡すことでdeletedAt判定の型安全性を向上
- example配下の利用例で論理削除・物理削除の切り替え動作を確認可能

---

## 📦 インストール

```bash
yarn add -D prisma-relation-helper-generator
# npmの場合: npm install --save-dev prisma-relation-helper-generator
```

## 📝 Prisma schema.prisma 設定例

```
generator client {
  provider = "prisma-client-js"
}

generator relationHelper {
  provider = "./dist/index.js"
  output   = "./dist/generated-helpers"
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

`./dist/generated-helpers/` ディレクトリに UserHelper.ts や ProfileHelper.ts が自動生成されます。

## 使用例

```ts
import { UserHelper } from '../dist/generated-helpers/UserHelper';

(async () => {
  // 単一レコードの取得
  const user = await UserHelper.findById(1);
  console.log(user?.profile?.image);

  // 条件付きで複数レコード取得
  const users = await UserHelper.where({ name: { contains: 'Taro' } }).get();
  console.log(users);

  // 型安全なリレーション事前読み込み（withなしでも全リレーション自動eager load）
  const userAndProfile = await UserHelper.where({ name: 'Taro' }).first();
  console.log('User and profile:', userAndProfile?.profile);

  // withを使うと特定リレーションのみeager load
  const userWithProfile = await UserHelper.with('profile')
    .where({ name: 'Taro' })
    .first();
  console.log('User with profile:', userWithProfile?.profile);

  // createdAt昇順ソート
  const usersAsc = await UserHelper.where({}).orderBy('createdAt', 'asc').get();
  console.log(
    'Users (createdAt asc):',
    usersAsc.map((u) => ({ name: u.name, createdAt: u.createdAt })),
  );

  // createdAt降順ソート
  const usersDesc = await UserHelper.where({})
    .orderBy('createdAt', 'desc')
    .get();
  console.log(
    'Users (createdAt desc):',
    usersDesc.map((u) => ({ name: u.name, createdAt: u.createdAt })),
  );

  // activeスコープ（拡張例）
  // example/extended/UserHelper.ts でUserHelper/QueryBuilderを拡張し、active()を追加
  import { UserHelper as ExtendedUserHelper } from './extended/UserHelper';
  const activeUsers = await ExtendedUserHelper.active().get();
  console.log(
    'Active users:',
    activeUsers.map((u) => ({ name: u.name, isActive: u.isActive })),
  );
})();
```

## シードデータ（オプション）

```
"scripts": {
  "seed": "ts-node prisma/seed.ts"
}
```
