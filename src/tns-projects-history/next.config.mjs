/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_PAGES === 'true' ? '/tns-project-history' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/tns-project-history/' : '',
  trailingSlash: true,
}
export default nextConfig;
