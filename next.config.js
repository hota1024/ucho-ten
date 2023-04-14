const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  webpack(config, options) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'app')

    return config
  }
}
