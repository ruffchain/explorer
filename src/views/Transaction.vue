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
    <PageBreadcrumb :title="strTitle" />
    <template v-if="data">
      <div class="card">
        <ParameterRow :name="strHash">{{ data.tx.hash }}</ParameterRow>
        <ParameterRow
          :name="strTime"
        >{{ data.block.timestamp | ms | dateformat('YYYY-MM-DD HH:mm:ss') }}</ParameterRow>
        <ParameterRow :name="strBlock">
          <router-link :to="`/block/${data.block.number}`">{{ data.block.number }}</router-link>
        </ParameterRow>
        <ParameterRow :name="strSender">
          <router-link :to="`/address/${data.tx.caller}`">{{$_APP.ADDRESS_PREFIX +data.tx.caller }}</router-link>
        </ParameterRow>
      </div>
      <div class="card" style="margin:10px 0">
        <el-tabs v-model="activeTab" style="margin-top:-5px">
          <el-tab-pane :label="strRaw" name="0">
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
    ParameterRow,
  },
  data() {
    return {
      activeTab: 0,
      data: null,
    }
  },
  mounted() {
    this.update()
  },
  beforeRouteUpdate(to, from, next) {
    this.update()
    next()
  },
  computed: {
    strTitle() {
      return this.$t('Transaction.title')
    },
    strHash() {
      return this.$t('Transaction.hash')
    },
    strTime() {
      return this.$t('Transaction.time')
    },
    strBlock() {
      return this.$t('Transaction.block')
    },
    strSender() {
      return this.$t('Transaction.sender')
    },
    strRaw() {
      return this.$t('Transaction.raw')
    },
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
    },
  },
}
</script>
