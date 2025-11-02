# ステージ1: ビルド
FROM node:20 AS build
WORKDIR /app

# package.jsonとpackage-lock.jsonを先にコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# ビルド実行
RUN npm run build

# ステージ2: 本番環境（nginx）
FROM nginx:alpine

# envsubstコマンドをインストール（環境変数の置換に必要）
RUN apk add --no-cache gettext

# ビルド結果をnginxのドキュメントルートにコピー
COPY --from=build /app/dist /usr/share/nginx/html

# nginx設定をテンプレートとしてコピー
COPY nginx.conf /etc/nginx/templates/default.conf.template

# エントリポイントスクリプトをコピーして実行権限を付与
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Railwayが動的に割り当てるポートを環境変数から取得
ENV PORT=80

# エントリポイントを設定
ENTRYPOINT ["/docker-entrypoint.sh"]

# nginxを起動
CMD ["nginx", "-g", "daemon off;"]