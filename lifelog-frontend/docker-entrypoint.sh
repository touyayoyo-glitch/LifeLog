#!/bin/sh
set -e

# RailwayのPORT環境変数を使用してnginx設定を生成
export PORT=${PORT:-80}
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Nginxを起動
exec "$@"
