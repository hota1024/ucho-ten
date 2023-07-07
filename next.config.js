const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  experimental: {
    appDir: true
  },
  async headers() {
    return [
      {
        "source": "/(.*)",
        "headers": [
          { "key": "Access-Control-Allow-Credentials", "value": "true" },
          { "key": "Access-Control-Allow-Origin", "value": "*" },
          { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
        ]
      }
    ]
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
