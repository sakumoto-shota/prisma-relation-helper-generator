const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('./dist/index.js');

// ファイルの存在チェック
if (!fs.existsSync(targetFile)) {
  console.error('❌ dist/index.js が存在しません。先に yarn build を実行してください。');
  process.exit(1);
}

const content = fs.readFileSync(targetFile, 'utf-8');

// 既に shebang があるか確認
if (!content.startsWith('#!/usr/bin/env node')) {
  const newContent = '#!/usr/bin/env node\n' + content;
  fs.writeFileSync(targetFile, newContent, 'utf-8');
  console.log('✅ shebang を追加しました');
} else {
  console.log('✅ shebang は既に存在します');
}

// 実行権限を付与
fs.chmodSync(targetFile, 0o755);
console.log('✅ 実行権限を付与しました');
