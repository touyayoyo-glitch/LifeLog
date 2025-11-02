FROM node:20-alpine AS build
WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピーしてビルド
COPY . .
RUN npx vite build

# Nginxで配信
FROM nginx:alpine

# デフォルトのnginx設定を削除
RUN rm /etc/nginx/conf.d/default.conf

# カスタムnginx設定をコピー
COPY nginx.conf /etc/nginx/templates/default.conf.template

# ビルドしたファイルをコピー
COPY --from=build /app/dist /usr/share/nginx/html

# Railwayの$PORTを使用するための起動スクリプト
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

EXPOSE $PORT

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
