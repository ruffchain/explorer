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
    <PageBreadcrumb :title="strAccount" />
    <section class="card">
      <ParameterRow :name="strAddress">{{$_APP.ADDRESS_PREFIX }}{{ address }}</ParameterRow>
      <template v-if="bpInfo.candidate">
        <ParameterRow :name="strName">{{ bpInfo.name | slice(1) }}</ParameterRow>
        <ParameterRow :name="strVotes">{{ bpInfo.vote | slice(1) }}</ParameterRow>
        <ParameterRow :name="strIp">{{ bpInfo.ip | slice(1) }}</ParameterRow>
        <!-- <ParameterRow name="节点网址:">
          <a :href="bpInfo.url.slice(1)" target="_blank">
            {{ bpInfo.url | slice(1) }}
          </a>
        </ParameterRow>-->
        <ParameterRow :name="strLocation">{{ bpInfo.location | slice(1) }}</ParameterRow>
      </template>
      <TokenList :address="address" />
    </section>

    <div class="card" style="margin:10px 0">
      <el-tabs v-model="activeTab" style="margin-top:-5px">
        <el-tab-pane :label="strHistory" name="0" class="tx-history-tab">
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
    AddressTxHistory,
  },
  data() {
    return {
      activeTab: 0,
      bpInfo: {},
    }
  },
  computed: {
    address() {
      return this.$route.params.address
    },
    strAccount() {
      return this.$t('Address.account')
    },
    strAddress() {
      return this.$t('Address.address')
    },
    strName() {
      return this.$t('Address.name')
    },
    strVotes() {
      return this.$t('Address.votes')
    },
    strIp() {
      return this.$t('Address.ip')
    },
    strLocation() {
      return this.$t('Address.location')
    },
    strHistory() {
      return this.$t('Address.history')
    },
  },
  mounted() {
    chainApi.getCandidateInfo(this.address).then((res) => {
      this.bpInfo = res.value
    })
  },
}
</script>
