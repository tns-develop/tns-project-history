# エラーになったら手動でプルしてください 「docker pull docker.io/library/node:19-buster-slim」
# FROM ubuntu:latest
FROM node:22-slim
WORKDIR /app

ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 開発に必要なツールをインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    npm \
    nano \
    openssh-client \
    # VSCode Server に必要なパッケージ
    procps \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# gitの設定
RUN git config --global init.defaultBranch main
