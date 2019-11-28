module.exports = {
  devServer: {
    proxy: {
      '/chain-rpc': {
        target: 'http://replace-your-chain-rpc-url',
        changeOrigin: true,
        pathRewrite: {
          '^/chain-rpc': '/rpc'
        }
      },
      '/chain-info-rpc': {
        target: 'http://replace-your-explorer-backend-url',
        changeOrigin: true,
        pathRewrite: {
          '^/chain-info-rpc': '/rpc'
        }
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.externals = {
        'element-ui': 'ELEMENT',
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        'bignumber.js': 'BigNumber'
      }
    }
    config.devtool = 'source-map'
  },
  pwa: {
    workboxOptions: {
      // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
      skipWaiting: true,
      clientsClaim: true,
      importWorkboxFrom: 'local',
      importsDirectory: 'js',
      navigateFallback: '/',
      navigateFallbackBlacklist: [/\/api\//]
    }
  }
}
