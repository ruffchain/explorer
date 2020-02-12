<style lang="scss" scoped>
.search-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    font-size: 22px;
    font-weight: bolder;
  }
  ul > li {
    line-height: 24px;
  }
  .return-home-btn-box {
    margin-top: 15px;
    text-align: center;
    a {
      text-decoration: none;
    }
  }
}
</style>

<template>
  <div class="search-view">
    <div v-if="noResult">
      <div class="title">找不到结果,支持以下搜索:</div>
      <ul>
        <li>区块编号 ( 示例 : 123 )</li>
        <li>区块 ID ( 示例 : 长度为64的哈希字符串)</li>
        <li>交易 ID ( 示例 : 长度为64的哈希字符串)</li>
        <li>地 址 ( 示例 : 长度为38的前缀为ruff的哈希字符串)</li>
      </ul>
      <div class="return-home-btn-box">
        <router-link class="el-button el-button--primary el-button--small" to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { PageType } from '../common/enums.js'
import { search } from '../common/chain-api.js'
import {
  ADDRESS_PREFIX,
  rmAddressPrefix,
  isValidAddressPrefix
} from '../common/utils'

export default {
  data() {
    return {
      noResult: false,
      search: ''
    }
  },
  mounted() {
    this.search = this.$route.params.search
    this.searching()
  },
  beforeRouteUpdate({ params }, from, next) {
    this.search = params.search
    this.searching()
    next()
  },
  methods: {
    async searching() {
      this.$_APP.loading = true
      this.noResult = false
      try {
        let searchStr = this.search

        if (
          searchStr.length === 34 + ADDRESS_PREFIX.length &&
          isValidAddressPrefix(searchStr)
        ) {
          searchStr = rmAddressPrefix(searchStr)
        }
        const res = await search(searchStr)
        if (res.length) {
          const [{ type }] = res
          let route = ''
          switch (type) {
            case PageType.BLOCK:
              route = '/block/'
              break
            case PageType.TX:
              route = '/tx/'
              break
            case PageType.ADDRESS:
              route = '/address/'
              break
            case PageType.TOKEN:
              route = '/token/'
              break
          }
          this.$router.replace({
            path: route + searchStr
          })
        } else {
          this.noResult = true
        }
      } catch (e) {
      } finally {
        this.$_APP.loading = false
      }
    }
  }
}
</script>
