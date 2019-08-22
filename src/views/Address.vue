<style lang="scss">
.address-detail {
  .tx-history-tab {
    overflow-x: auto;
    .tx-history-view {
      width: 1170px;
      box-sizing: border-box;
    }
  }
}
</style>

<template>
  <div class="address-detail">
    <PageBreadcrumb title="账号详情" />
    <section class="card">
      <ParameterRow name="账户地址:">
        {{ address }}
      </ParameterRow>
      <template v-if="bpInfo.candidate">
        <ParameterRow name="节点名称:">
          {{ bpInfo.name | slice(1) }}
        </ParameterRow>
        <ParameterRow name="节点得票数:">
          {{ bpInfo.vote | slice(1) }}
        </ParameterRow>
        <ParameterRow name="节点IP:">
          {{ bpInfo.ip | slice(1) }}
        </ParameterRow>
        <!-- <ParameterRow name="节点网址:">
          <a :href="bpInfo.url.slice(1)" target="_blank">
            {{ bpInfo.url | slice(1) }}
          </a>
        </ParameterRow> -->
        <ParameterRow name="节点位置:">
          {{ bpInfo.location | slice(1) }}
        </ParameterRow>
      </template>
      <TokenList :address="address" />
    </section>

    <div class="card" style="margin:10px 0">
      <el-tabs v-model="activeTab" style="margin-top:-5px">
        <el-tab-pane label="交易历史" name="0" class="tx-history-tab">
          <AddressTxHistory :address="address" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import PageBreadcrumb from '@/components/PageBreadcrumb'
import ParameterRow from '@/components/ParameterRow'
import TokenList from '@/components/TokenList'
import AddressTxHistory from '@/components/AddressTxHistory'
import * as chainApi from '../common/chain-api.js'

export default {
  components: {
    PageBreadcrumb,
    ParameterRow,
    TokenList,
    AddressTxHistory
  },
  data() {
    return {
      activeTab: 0,
      bpInfo: {}
    }
  },
  computed: {
    address() {
      return this.$route.params.address
    }
  },
  mounted() {
    chainApi.getCandidateInfo(this.address).then(res => {
      this.bpInfo = res.value
    })
  }
}
</script>
