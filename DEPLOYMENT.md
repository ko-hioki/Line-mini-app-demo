# 📱 LINEミニアプリ登録手順

## 🚀 Step 1: GitHub Pages でHTTPS配信

### 1-1. GitHubリポジトリ作成
1. [GitHub](https://github.com) にアクセスしてログイン
2. 右上の「+」→「New repository」をクリック
3. Repository name: `line-mini-app-demo`（任意の名前）
4. Public を選択
5. 「Create repository」をクリック

### 1-2. ローカルリポジトリをプッシュ
```bash
# 現在のディレクトリで実行（既に完了）
git init
git add .
git commit -m "Initial commit: LINE Mini App Demo"

# GitHubリポジトリのURLを設定（作成後に実行）
git remote add origin https://github.com/YOUR_USERNAME/line-mini-app-demo.git
git branch -M main
git push -u origin main
```

### 1-3. GitHub Pages 有効化
1. GitHubのリポジトリページで「Settings」タブをクリック
2. 左サイドバーの「Pages」をクリック
3. Source: 「Deploy from a branch」を選択
4. Branch: 「main」を選択、フォルダは「/ (root)」
5. 「Save」をクリック
6. 数分後に `https://YOUR_USERNAME.github.io/line-mini-app-demo/` でアクセス可能

## 🔧 Step 2: LINE Developers Console設定

### 2-1. LINE Developersアカウント作成
1. [LINE Developers Console](https://developers.line.biz/console/) にアクセス
2. LINEアカウントでログイン
3. プロバイダーを作成（会社名や個人名）

### 2-2. チャンネル作成
1. 「Create a new channel」をクリック
2. 「Messaging API」を選択
3. 必要事項を入力：
   - Channel name: LINE ミニアプリ デモ
   - Channel description: デモ用ミニアプリ
   - Category: Developer Tools
   - Subcategory: Development Tools
4. 利用規約に同意して「Create」

### 2-3. LIFF アプリ追加
1. 作成したチャンネルの「LIFF」タブをクリック
2. 「Add」ボタンをクリック
3. 設定内容：
   - **LIFF app name**: LINE ミニアプリ デモ
   - **Size**: Full（推奨）
   - **Endpoint URL**: `https://YOUR_USERNAME.github.io/line-mini-app-demo/`
   - **Scope**: `profile`, `openid`, `chat_message.write` を選択
   - **Bot Link Feature**: Aggressive（推奨）
4. 「Add」をクリック

### 2-4. LIFF ID取得
- 作成されたLIFFアプリのLIFF IDをコピー
- 例: `1234567890-AbCdEfGh`

## ⚙️ Step 3: アプリケーション設定

### 3-1. LIFF ID設定
`script.js` の1行目を編集：
```javascript
const LIFF_ID = '1234567890-AbCdEfGh'; // 実際のLIFF IDに置き換え
```

### 3-2. 変更をGitHubにプッシュ
```bash
git add script.js
git commit -m "Update LIFF ID"
git push origin main
```

## 📱 Step 4: テストと確認

### 4-1. LIFFアプリURL生成
- LIFF URL: `https://liff.line.me/YOUR_LIFF_ID`
- 例: `https://liff.line.me/1234567890-AbCdEfGh`

### 4-2. テスト手順
1. LINEアプリで友達またはグループチャットを開く
2. 生成したLIFF URLを送信
3. URLをタップしてミニアプリを起動
4. 各機能をテスト

### 4-3. QRコードでのテスト
LIFF URLのQRコードを生成してテストも可能：
- [QR Code Generator](https://www.qr-code-generator.com/)
- [Google Charts QR API](https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=https://liff.line.me/YOUR_LIFF_ID)

## 🔍 トラブルシューティング

### よくある問題と解決方法

#### 1. LIFF初期化エラー
- LIFF IDが正しく設定されているか確認
- Endpoint URLがHTTPSで正しく設定されているか確認

#### 2. 権限エラー
- LIFFのScopeが適切に設定されているか確認
- `profile`, `openid`, `chat_message.write`が選択されているか確認

#### 3. QRスキャンが動作しない
- HTTPS環境で実行されているか確認
- LINEアプリ内で実行されているか確認

## 📋 チェックリスト

設定完了チェックリスト：

- [ ] GitHubリポジトリ作成
- [ ] GitHub Pages有効化
- [ ] HTTPS URLでアクセス確認
- [ ] LINE Developersアカウント作成
- [ ] Messaging APIチャンネル作成
- [ ] LIFFアプリ追加
- [ ] LIFF ID取得
- [ ] script.jsでLIFF ID設定
- [ ] 変更をGitHubにプッシュ
- [ ] LIFF URLでアプリ起動テスト
- [ ] 各機能の動作確認

## 🎯 完了後の活用

設定完了後は以下が可能になります：

✅ **利用可能な機能**
- LINE認証・ログイン
- ユーザープロフィール取得
- QRコードスキャン
- LINEメッセージ送信
- コンテンツ共有
- 位置情報取得
- デバイス情報取得

📱 **配布方法**
- LIFF URLを直接共有
- QRコードで共有
- LINEボットのリッチメニューに組み込み
- Webサイトにリンク埋め込み
