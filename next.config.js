/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Remove basePath if deploying to username.github.io or custom domain
  // basePath: '/hugsy-web',  // Uncomment if deploying to username.github.io/hugsy-web
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}