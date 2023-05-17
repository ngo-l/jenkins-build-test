/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash:true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  staticPageGenerationTimeout: 1000
}

module.exports = nextConfig
