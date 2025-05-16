/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost']
  },
  serverRuntimeConfig: {
    port: 8081
  }
}

module.exports = nextConfig
