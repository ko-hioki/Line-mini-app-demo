#!/bin/bash

echo "🚀 LINE ミニアプリ デプロイメント支援スクリプト"
echo "================================================"
echo ""

# LIFF ID入力
read -p "📝 LIFF ID を入力してください (例: 1234567890-AbCdEfGh): " LIFF_ID

if [ -z "$LIFF_ID" ]; then
    echo "❌ LIFF ID が入力されていません。スクリプトを終了します。"
    exit 1
fi

# script.jsの更新
echo "⚙️ script.js を更新中..."
sed -i.bak "s/const LIFF_ID = 'YOUR_LIFF_ID';/const LIFF_ID = '$LIFF_ID';/g" script.js

if [ $? -eq 0 ]; then
    echo "✅ script.js の更新が完了しました"
    rm script.js.bak
else
    echo "❌ script.js の更新に失敗しました"
    exit 1
fi

# Gitの状態確認
if [ -d ".git" ]; then
    echo ""
    echo "📦 Git リポジトリの状態:"
    git status --porcelain
    
    echo ""
    read -p "🤔 変更をコミットしてプッシュしますか？ (y/N): " COMMIT_CHOICE
    
    if [ "$COMMIT_CHOICE" = "y" ] || [ "$COMMIT_CHOICE" = "Y" ]; then
        git add script.js
        git commit -m "Update LIFF ID: $LIFF_ID"
        
        echo ""
        read -p "🌐 GitHubにプッシュしますか？ (y/N): " PUSH_CHOICE
        
        if [ "$PUSH_CHOICE" = "y" ] || [ "$PUSH_CHOICE" = "Y" ]; then
            git push origin main
            echo "✅ GitHubへのプッシュが完了しました"
        fi
    fi
fi

echo ""
echo "🎉 設定完了！"
echo ""
echo "📱 次のステップ:"
echo "1. GitHubリポジトリでGitHub Pagesを有効化"
echo "2. LIFF URL でアプリをテスト: https://liff.line.me/$LIFF_ID"
echo "3. LINEアプリでURLを送信してテスト"
echo ""
echo "🔗 有用なリンク:"
echo "- LINE Developers Console: https://developers.line.biz/console/"
echo "- GitHub Pages 設定: https://github.com/settings/pages"
echo "- QR Code Generator: https://www.qr-code-generator.com/"
echo ""
