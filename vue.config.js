module.exports = {
  devServer: {
    proxy: {
      '/chain-rpc': {
        target: 'http://45.33.32.138:18089',
        changeOrigin: true,
        pathRewrite: {
          '^/chain-rpc': '/rpc'
        }
      },
      '/chain-info-rpc': {
        target: 'http://45.33.32.138:18080',
        changeOrigin: true,
        pathRewrite: {
          '^/chain-info-rpc': '/rpc'
        }
      },
      '/chain-earnings-rpc': {
        target: 'https://earnings.ruffcorp.com',
        changeOrigin: true,
        pathRewrite:{
          '^/chain-earnings-rpc': '/api/v1/account'
        }
      },
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
