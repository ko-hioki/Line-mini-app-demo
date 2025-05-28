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

### 2. 設定の更新

`script.js` ファイルの以下の部分を更新：

```javascript
const LIFF_ID = 'YOUR_LIFF_ID'; // 実際のLIFF IDに置き換えてください
```

### 3. HTTPSでの配信

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
3. **ログ出力**: `console.log`でデバッグ情報を出力

## 📋 ライセンス

MIT License

## 🤝 貢献

プルリクエストやイシューの報告は歓迎します。

## 📞 サポート

- [LINE Developers Documentation](https://developers.line.biz/ja/docs/liff/)
- [LIFF API Reference](https://developers.line.biz/ja/reference/liff/)

---

**注意**: このアプリケーションはデモンストレーション目的で作成されています。本番環境で使用する場合は、セキュリティやエラーハンドリングを強化してください。
