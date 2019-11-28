import Vue from 'vue'
import Element from 'element-ui'

import 'vue-material-design-icons/styles.css'

import './styles/site.scss'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import './common/extend-vue'

import * as chain from './common/chain-lib/index'
window.chain = chain

Vue.use(Element)

Vue.config.productionTip = false

new Vue({
  router,
  ...App
}).$mount('#app')
