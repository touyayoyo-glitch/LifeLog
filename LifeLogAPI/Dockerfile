FROM mcr.microsoft.comdotnetsdk8.0 AS build
WORKDIR app

# csprojファイルをコピーして復元
COPY .csproj .
RUN dotnet restore

# すべてのファイルをコピー
COPY . .

# ビルドして公開
RUN dotnet publish -c Release -o out

# ランタイムイメージ
FROM mcr.microsoft.comdotnetaspnet8.0
WORKDIR app
COPY --from=build appout .

# ポート設定（Railwayの$PORT変数を使用）
ENV ASPNETCORE_URLS=http+$PORT

ENTRYPOINT [dotnet, LifeLogAPI.dll]