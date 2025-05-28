#!/bin/bash

# .env.localファイルから環境変数を読み込んでenv.jsを生成するスクリプト

ENV_FILE=".env.local"
OUTPUT_FILE="env.js"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found!"
    echo "Please create .env.local file with your LIFF_ID"
    exit 1
fi

echo "Generating $OUTPUT_FILE from $ENV_FILE..."

# .env.localから環境変数を読み込み
source "$ENV_FILE"

# env.jsファイルを生成
cat > "$OUTPUT_FILE" << EOF
// 環境変数設定ファイル
// このファイルは .env.local から自動生成されます
// 直接編集しないでください

window.ENV = {
    LIFF_ID: '${LIFF_ID}',
    NODE_ENV: '${NODE_ENV:-development}'
};
EOF

echo "✅ $OUTPUT_FILE has been generated successfully!"
echo "LIFF_ID: ${LIFF_ID}"
