/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/hugsy-website',
  assetPrefix: '/hugsy-website',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig