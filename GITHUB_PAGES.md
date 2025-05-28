# 🚀 LINEミニアプリデモ - GitHub Pages配信中

このリポジトリは自動的にGitHub Pagesにデプロイされます。

## 📱 デプロイ済みURL

**GitHub Pages URL**: https://ko-hioki.github.io/Line-mini-app-demo/

## 🔧 次のステップ

### 1. GitHub Pagesの有効化（手動設定が必要）

1. [リポジトリのSettings](https://github.com/ko-hioki/Line-mini-app-demo/settings/pages) にアクセス
2. Source: **GitHub Actions** を選択
3. 自動的にWorkflowが実行されてデプロイされます

### 2. LIFF設定

1. [LINE Developers Console](https://developers.line.biz/console/) でLIFFアプリを作成
2. Endpoint URL: `https://ko-hioki.github.io/Line-mini-app-demo/`
3. LIFF IDを取得してscript.jsを更新

### 3. LIFF ID設定（自動スクリプト使用）

```bash
./setup-liff.sh
```

または手動で `script.js` の1行目を編集：
```javascript
const LIFF_ID = 'YOUR_ACTUAL_LIFF_ID';
```

## 🎯 テスト用URL

設定完了後、以下のURLでテスト：
- **LIFF URL**: `https://liff.line.me/YOUR_LIFF_ID`

詳細な手順は `DEPLOYMENT.md` をご確認ください。
