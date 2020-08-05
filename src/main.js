import Vue from 'vue'
import Element from 'element-ui'
import localeEn from 'element-ui/lib/locale/lang/en'
import localeZh from 'element-ui/lib/locale/lang/zh-CN'
import en from './common/lang/en'
import zh from './common/lang/zh'

import 'vue-material-design-icons/styles.css'

import './styles/site.scss'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import './common/extend-vue'

import * as chain from './common/chain-lib/index'

import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'

import { updateNewTimeAgo } from './common/utils'


window.chain = chain

Vue.use(VueI18n)

let curLocale = Cookies.get('locale') || 'zh-CN'
const i18n = new VueI18n({
  locale: curLocale,
  messages: {
    'zh-CN': {
      ...zh,
      ...localeZh
    },
    'en': {
      ...en,
      ...localeEn
    }
  }
})

updateNewTimeAgo();

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  ...App
}).$mount('#app')
