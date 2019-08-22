import Vue from 'vue'
import * as chainLib from './chain-lib'

const globalData = new Vue({
  data() {
    return {
      loading: false,
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
