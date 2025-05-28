# LINE ミニアプリ デモ

このプロジェクトは、LINE Front-end Framework (LIFF) を使用したミニアプリの機能をデモンストレーションするためのモックアプリケーションです。

## 🚀 機能

### 認証機能
- **LINE ログイン/ログアウト** - LIFFのOAuth機能を使用
- **ユーザープロフィール取得** - 名前、ID、プロフィール画像、ステータスメッセージ

### コミュニケーション機能
- **メッセージ送信** - LINEトークにテキストメッセージを送信
- **コンテンツ共有** - ShareTargetPickerを使用してコンテンツ共有
- **QRコードスキャン** - カメラを使用してQRコードを読み取り

### デバイス・環境機能
- **デバイス情報取得** - OS、言語、バージョン情報など
- **位置情報取得** - GPS/ネットワーク位置情報
- **外部ブラウザ起動** - 指定URLを外部ブラウザで開く
- **クリップボード操作** - テキストのコピー機能

### UI/UX機能
- **ウィンドウ制御** - LIFFウィンドウを閉じる
- **レスポンシブデザイン** - モバイルファースト対応
- **ローディング表示** - 非同期処理中の視覚的フィードバック
- **通知メッセージ** - 操作結果の表示

## 🛠️ 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **フレームワーク**: LINE Front-end Framework (LIFF) v2
- **デザイン**: カスタムCSS（LINEブランドカラー準拠）
- **レスポンシブ**: CSS Grid + Flexbox

## 📋 セットアップ

### 1. LIFF アプリの作成

1. [LINE Developers Console](https://developers.line.biz/console/) にアクセス
2. 新しいプロバイダーまたは既存のプロバイダーを選択
3. Messaging API チャンネルまたは LINE Login チャンネルを作成
4. LIFF アプリを追加
5. LIFF ID を取得

### 2. 環境変数の設定

`.env.local` ファイルを作成してLIFF IDを設定：

```bash
# .env.local ファイルを作成
cp .env.local.example .env.local

# または手動で作成
echo "LIFF_ID=YOUR_LIFF_ID" > .env.local
```

`.env.local` ファイルの内容例：
```
LIFF_ID=1234567890-abcdefgh
NODE_ENV=development
```

> **注意**: `.env.local` ファイルには実際のLIFF IDが含まれるため、Gitにコミットしないでください。このファイルは `.gitignore` に追加済みです。

### 3. 設定の更新（旧方式）

従来通り、`script.js` ファイルを直接編集することも可能：

```javascript
const LIFF_ID = 'YOUR_LIFF_ID'; // 実際のLIFF IDに置き換えてください
```

### 4. 開発の開始

環境変数を設定した後、以下のコマンドで開発を開始：

```bash
# 環境変数ファイルを生成してサーバー起動
npm start

# または個別に実行
./generate-env.sh  # 環境変数ファイル生成
python3 -m http.server 8000  # サーバー起動
```

### 5. HTTPSでの配信

LIFFアプリはHTTPS環境でのみ動作します。以下のいずれかの方法で配信：

#### ローカル開発（簡易HTTPSサーバー）

```bash
# Python 3の場合
python -m http.server 8000

# Node.jsのlive-serverを使用する場合
npx live-server --https=true --port=8443
```

#### GitHub Pages

1. GitHubリポジトリにプッシュ
2. Settings > Pages でGitHub Pagesを有効化
3. HTTPSで自動配信される

**Repository Secretsを使用したセキュアなデプロイ**

GitHub Pagesで安全にLIFF_IDを管理するために、Repository Secretsを使用：

1. **Repository Secretsの設定**:
   - GitHubリポジトリの `Settings` > `Security` > `Secrets and variables` > `Actions`
   - `New repository secret` をクリック
   - Name: `LIFF_ID`
   - Secret: 実際のLIFF ID値（例: `2007491656-bKpm0ygE`）

2. **自動デプロイ**:
   - `main`ブランチにpushすると、GitHub Actionsが自動実行
   - Repository SecretsからLIFF_IDを取得して`env.js`を生成
   - GitHub Pagesに自動デプロイ

3. **セキュリティ**:
   - LIFF_IDはRepository Secretsで安全に管理
   - `env.js`ファイルはデプロイ時に自動生成（リポジトリには含まれない）
   - 機密情報の漏洩リスクを最小化

#### Netlify

1. [Netlify](https://netlify.com)にサインアップ
2. プロジェクトフォルダをドラッグ&ドロップでデプロイ
3. 自動的にHTTPS URLが生成される

### 4. LIFF設定の更新

LINE Developers Consoleで以下を設定：

- **Endpoint URL**: デプロイしたアプリのHTTPS URL
- **Scope**: `profile`, `openid`, `chat_message.write`
- **Bot Link Feature**: 必要に応じて有効化

## 🎯 使用方法

### 基本操作

1. **ログイン**: 「LINEログイン」ボタンでLINE認証
2. **プロフィール確認**: ログイン後、ユーザー情報カードでプロフィール表示
3. **機能テスト**: 各機能カードのボタンをクリックして動作確認

### 機能詳細

#### QRコードスキャン
- 「QRスキャン開始」ボタンをクリック
- カメラが起動し、QRコードを読み取り
- 結果が画面に表示される

#### メッセージ送信
- テキストエリアにメッセージを入力
- 「メッセージ送信」ボタンでLINEトークに送信
- Enterキーでも送信可能

####位置情報取得
- 「位置情報取得」ボタンをクリック
- ブラウザの位置情報許可が必要
- 緯度・経度・精度が表示される

## 🔧 モック機能

LIFF SDKが利用できない環境（通常のブラウザなど）では、自動的にモックモードで動作：

- デモユーザーでのログイン
- 模擬QRコード読み取り
- 模擬メッセージ送信・共有
- 実際のデバイス情報表示

## 📱 対応環境

### LINE環境
- LINE内ブラウザ（推奨）
- LIFFアプリとして動作

### 一般ブラウザ（モックモード）
- Chrome 60+
- Safari 12+
- Firefox 60+
- Edge 79+

### モバイル対応
- iOS Safari 12+
- Android Chrome 60+
- レスポンシブデザイン対応

## 🐛 トラブルシューティング

### よくある問題

#### LIFF初期化エラー
```
LIFF initialization failed
```
**解決方法**: LIFF_IDが正しく設定されているか確認

#### 400 Bad Request エラー
```
400 Bad Request at login
```
**解決方法**: 
1. LIFF_IDが正しいか確認
2. LINE Developers ConsoleでEndpoint URLが正しく設定されているか確認
3. LIFFアプリの設定で正しいスコープ（profile, openid等）が設定されているか確認
4. HTTPSで配信されているか確認
5. 診断ツール（`diagnostic.html`）を使用して詳細をチェック

#### QRスキャンが動作しない
```
QR scan not available
```
**解決方法**: HTTPS環境で実行し、カメラ権限を許可

#### 位置情報が取得できない
```
Geolocation not available
```
**解決方法**: HTTPS環境で実行し、位置情報権限を許可

### デバッグ方法

1. **開発者ツール**: ブラウザのコンソールでエラーログを確認
2. **LIFF Inspector**: LINE Developers Consoleの「LIFF Inspector」を使用
3. **診断ツール**: `diagnostic.html`でLIFF環境を詳細チェック
4. **ログ出力**: `console.log`でデバッグ情報を出力

### 診断ツール（diagnostic.html）

LIFF関連の問題を診断するための専用ツール：

- **LIFF_ID設定状況**の確認
- **HTTPS環境**の確認
- **LINE環境**の検出
- **LIFF SDK**の可用性チェック
- **詳細なエラー情報**の表示

使用方法:
```
https://your-domain.com/diagnostic.html
```

## 📋 ライセンス

MIT License

## 🤝 貢献

プルリクエストやイシューの報告は歓迎します。

## 📞 サポート

- [LINE Developers Documentation](https://developers.line.biz/ja/docs/liff/)
- [LIFF API Reference](https://developers.line.biz/ja/reference/liff/)

---

**注意**: このアプリケーションはデモンストレーション目的で作成されています。本番環境で使用する場合は、セキュリティやエラーハンドリングを強化してください。
