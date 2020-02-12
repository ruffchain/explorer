import Vue from 'vue'
import * as chainLib from './chain-lib'

const globalData = new Vue({
  data() {
    return {
      loading: false,
      CORE_SYMBOL: process.env.VUE_APP_CORE_SYMBOL,
      IS_TESTNET: process.env.VUE_APP_IS_TESTNET === 'true',
      ADDRESS_PREFIX: process.env.VUE_APP_ADDRESS_PREFIX,
      privateKey: ''
    }
  },
  computed: {
    address() {
      return this.privateKey
        ? chainLib.addressFromSecretKey(this.privateKey)
        : ''
    }
  }
})

Vue.prototype.$_APP = globalData

if (process.env.NODE_ENV === 'development') {
  window.$_APP = globalData
}

export default globalData
