const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack(config, options) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')

    return config
  }
}
