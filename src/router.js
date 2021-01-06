import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home/Home.vue'
import Block from './views/Block.vue'
import Transaction from './views/Transaction.vue'
import Address from './views/Address.vue'
import Token from './views/Token.vue'
import Wallet from './views/Account/Wallet.vue'

import Search from './views/Search'
import AddressToHex from './views/Tools/AddressToHex'

import globalData from './common/global-data.js'

// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => {
//       err
//   }
//   )
// }

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/block/:which',
      name: 'Block',
      component: Block
    },
    {
      path: '/tx/:hash',
      name: 'Transaction',
      component: Transaction
    },
    {
      path: '/address/:address',
      name: 'Address',
      component: Address
    },
    {
      path: '/token/:tokenName',
      name: 'Token',
      component: Token
    },
    {
      path: '/search/:search',
      name: 'Search',
      component: Search
    },
    {
      path: '/wallet',
      name: 'Wallet',
      component: Wallet
    },
    {
      path: '/tools/address2hex',
      name: 'AddressToHex',
      component: AddressToHex
    }
  ]
})

export default router

router.beforeEach((to, from, next) => {
  globalData.loading = false
  next()
})
