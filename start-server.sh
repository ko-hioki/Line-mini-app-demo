#!/bin/bash

echo "🚀 LINEミニアプリ ローカル開発サーバー起動スクリプト"
echo ""

# 環境変数ファイル生成
echo "📋 環境変数設定を確認中..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local found - 環境変数ファイルを生成中..."
    ./generate-env.sh
else
    echo "⚠️  .env.local not found - デフォルト設定を使用"
    echo "💡 .env.local ファイルを作成してLIFF_IDを設定することを推奨します"
fi
echo ""

# オプション1: Python HTTP サーバー（推奨）
echo "オプション1: Python HTTP サーバー (推奨)"
echo "実行コマンド: python3 -m http.server 8000"
echo "URL: http://localhost:8000"
echo ""

# オプション2: Node.js http-server
echo "オプション2: Node.js http-server"
echo "インストール: npm install -g http-server"
echo "実行コマンド: http-server -p 8000"
echo "URL: http://localhost:8000"
echo ""

# オプション3: PHP内蔵サーバー（PHPがインストールされている場合）
echo "オプション3: PHP内蔵サーバー"
echo "実行コマンド: php -S localhost:8000"
echo "URL: http://localhost:8000"
echo ""

echo "🔒 HTTPS対応（LIFFテスト用）:"
echo "本格的なLIFFテストには以下を推奨:"
echo "- GitHub Pages (https://pages.github.com/)"
echo "- Netlify (https://netlify.com/)"
echo "- Vercel (https://vercel.com/)"
echo ""

echo "📱 現在のモックモードでテスト可能な機能:"
echo "✅ UI/UXの確認"
echo "✅ レスポンシブデザインの確認"
echo "✅ モック認証機能"
echo "✅ 位置情報取得（ブラウザ権限必要）"
echo "✅ クリップボード操作"
echo ""

echo "🚫 HTTPS環境が必要な機能:"
echo "❌ 実際のLINE認証"
echo "❌ QRコード読み取り"
echo "❌ LINEメッセージ送信"
echo "❌ LINE共有機能"
