# エラーになったら手動でプルしてください 「docker pull docker.io/library/node:22.18.0-bullseye-slim」
# FROM ubuntu:latest
FROM node:22.18.0-bullseye-slim
WORKDIR /app

# タイムゾーンはdocker-compose.ymlの環境変数で設定

# 開発に必要なツールをインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    npm \
    nano \
    openssh-client \
    zsh \
    procps \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# gitの設定
RUN git config --global init.defaultBranch main
