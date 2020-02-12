<style lang="scss">
.tx-detail {
  .text {
    font-size: 20px;
    font-weight: bolder;
    margin-bottom: 15px;
  }
}
</style>

<template>
  <div class="tx-detail">
    <PageBreadcrumb title="交易详情" />
    <template v-if="data">
      <div class="card">
        <ParameterRow name="交易哈希:">
          {{ data.tx.hash }}
        </ParameterRow>
        <ParameterRow name="交易时间:">
          {{ data.block.timestamp | ms | dateformat('YYYY-MM-DD HH:mm:ss') }}
        </ParameterRow>
        <ParameterRow name="所在区块:">
          <router-link :to="`/block/${data.block.number}`">
            {{ data.block.number }}
          </router-link>
        </ParameterRow>
        <ParameterRow name="发起方:">
          <router-link :to="`/address/${data.tx.caller}`">{{$_APP.ADDRESS_PREFIX +data.tx.caller }}</router-link>
        </ParameterRow>
      </div>
      <div class="card" style="margin:10px 0">
        <el-tabs v-model="activeTab" style="margin-top:-5px">
          <el-tab-pane label="原始数据" name="0">
            <JsonTreeView :data="data" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </div>
</template>

<script>
import JsonTreeView from '@/components/JsonTreeView/JsonTreeView'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import ParameterRow from '@/components/ParameterRow'
import * as chainApi from '../common/chain-api.js'

export default {
  components: {
    JsonTreeView,
    PageBreadcrumb,
    ParameterRow
  },
  data() {
    return {
      activeTab: 0,
      data: null
    }
  },
  mounted() {
    this.update()
  },
  beforeRouteUpdate(to, from, next) {
    this.update()
    next()
  },
  methods: {
    async update() {
      this.$_APP.loading = true
      try {
        const data = await chainApi.getTransaction(this.$route.params.hash)
        this.data = data
      } catch (e) {
        console.error(e)
      } finally {
        this.$_APP.loading = false
      }
    }
  }
}
</script>
