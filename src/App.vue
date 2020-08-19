<style lang="scss">
#app {
  height: 100%;
  background: #f2f2f2;
}

@media (min-width: 768px) {
  #app {
    min-width: 1200px;
  }
}

.router-view-ct {
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 15px;
}

.router-view {
  margin: 0 auto;
  max-width: 1200px;
}
</style>

<template>
  <div id="app" class="layout-column">
    <el-alert v-if="$_APP.IS_TESTNET" :title="strTitle" type="warning" show-icon></el-alert>
    <AppHeader />
    <div class="flex router-view-ct">
      <router-view class="router-view" />
    </div>
    <AppLoading :loading="$_APP.loading" />
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'
import AppLoading from './components/AppLoading'
export default {
  components: {
    AppHeader,
    AppFooter,
    AppLoading,
  },
  computed: {
    strTitle() {
      return this.$t('APP.title')
    },
  },
}
</script>
