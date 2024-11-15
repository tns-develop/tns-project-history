/** @type {import('next').NextConfig} */
const nextConfig = {
  // エラーログを詳細に表示
  onError: (err) => {
    console.error(err);
  },
  // 開発時のソースマップを有効化
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'source-map';
    }
    return config;
  }
}

module.exports = nextConfig 