const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    AIRSTACK_API_KEY: process.env.AIRSTACK_API_KEY,
    GENESIS_BLOCK: process.env.GENESIS_BLOCK,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    APP_URL: process.env.APP_URL,
    WS_URL: process.env.WS_URL,
  },
  env: {
    PROVIDER_URL: process.env.PROVIDER_URL,
    APP_URL: process.env.APP_URL,
    AUTHORS: process.env.AUTHORS,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
