const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  assetPrefix: '',
  reactStrictMode: false,
  experimental: {
    appDir: true
  },
  webpack(config, options) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'app')

    return config
  },
  eslint: {
    // @react-aria/i18n でエラーが出るため Lint を無効化
    ignoreDuringBuilds: true,
    ignoreBuildErrors: true,
  },
}
