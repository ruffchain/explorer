<style lang="scss" scoped>
ul.token-list {
  margin: 0 -5px;
  line-height: 2;
  text-align: center;
  & > li {
    .token-piece {
      margin: 5px;
      border-radius: 6px;
      border: solid 1px #eee;
      padding: 20px;
      overflow: hidden;
      .coin-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 5px;
        background-size: 100% 100%;
        &.sys {
          background-image: url(../assets/sys_token.png);
        }
        &.bancor {
          background-image: url(../assets/smart_token.png);
        }
        &.normal {
          background-image: url(../assets/normal_token.png);
        }
      }
      .token-name {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .token-amount {
        display: block;
      }
    }
  }
}
</style>
<template>
  <LoadingContainer :loading="loading">
    <el-row class="token-list" tag="ul">
      <el-col v-for="token in tokens" :key="token.token" :xs="12" :sm="4" tag="li">
        <div class="token-piece">
          <span class="token-name">
            <div class="coin-icon" :class="[token.tokentype]"></div>
            <router-link :to="`/token/${token.token}`">{{ token.token }}</router-link>
          </span>
          <span class="token-amount">{{ token.amount }}</span>
        </div>
      </el-col>
    </el-row>
  </LoadingContainer>
</template>

<script>
import * as chainApi from '../common/chain-api.js'
import LoadingContainer from './LoadingContainer'
import { delay } from '../common/utils'

export default {
  props: {
    address: {}
  },
  components: {
    LoadingContainer
  },
  data() {
    return {
      tokens: [],
      loading: true
    }
  },
  mounted() {
    this.loading = true
    this.updateTokenList()
  },
  methods: {
    async updateTokenList() {
      while (true) {
        if (this._destoryed) return
        try {
          this.tokens = await chainApi.getTokensByAddress(this.address)
        } catch (e) {}
        this.loading = false
        await delay(10000)
      }
    }
  },

  beforeDestroy() {
    this._destoryed = true
  }
}
</script>
