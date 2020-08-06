<style lang="scss">
.token-detail {
  .data-list {
    .list-header {
      font-weight: bolder;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .list-row {
      padding: 10px 0;
      border-top: solid 1px #eee;
    }
  }
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
</style>

<template>
  <div class="token-detail">
    <PageBreadcrumb :title="strTitle" />
    <template v-if="info">
      <section class="card">
        <ParameterRow :name="strTokenName">{{ info.name }}</ParameterRow>
        <ParameterRow :name="strTokenType">
          {{
          info.type === 'bancor'
          ? strSmart
          : info.type === 'sys'
          ? strSystem
          : strNormal
          }}
          Token
        </ParameterRow>
        <template v-if="info.type === 'bancor'">
          <ParameterRow :name="strFactor">{{ info.content.factor }}</ParameterRow>
          <ParameterRow :name="strCirculation">{{ info.content.supply }}</ParameterRow>
          <ParameterRow :name="strNonliquidity">{{ info.content.nonliquidity }}</ParameterRow>
          <ParameterRow
            :name="strSupplyTotal"
          >{{ -(-info.content.supply - info.content.nonliquidity) }}</ParameterRow>
          <ParameterRow :name="strReserve">{{ bancorTokenParams.R }}</ParameterRow>
          <ParameterRow :name="strHolding">{{ bancorTokenParams.S }}</ParameterRow>
        </template>
        <template v-else>
          <ParameterRow :name="strSupplyTotal">{{ info.content.supply }}</ParameterRow>
          <ParameterRow :name="strPrecision">{{ info.content.precision }}</ParameterRow>
        </template>
        <ParameterRow
          v-if="info.timestamp"
          :name="strCreateTime"
        >{{ info.timestamp | ms | dateformat('YYYY-MM-DD HH:mm:ss') }}</ParameterRow>
        <ParameterRow v-if="info.address != '-'" :name="strCreateAccount">
          <router-link :to="`/address/${info.address}`">{{$_APP.ADDRESS_PREFIX}}{{ info.address }}</router-link>
        </ParameterRow>
      </section>

      <section v-if="listData" class="card" style="margin:10px 0">
        <el-tabs v-model="activeTab" style="margin-top:-5px">
          <el-tab-pane :label="strHoldingAccount" name="0">
            <ul class="data-list">
              <el-row class="text-center list-header" tag="li">
                <el-col :span="16">{{strAccount}}</el-col>
                <el-col :span="8">{{strAmount}}</el-col>
              </el-row>
              <el-row
                v-for="item in listData.data"
                :key="item.address"
                type="flex"
                tag="li"
                class="text-center list-row"
              >
                <el-col :span="16" class="text-ellipsis">
                  <router-link :to="`/address/${item.hash}`">{{$_APP.ADDRESS_PREFIX}}{{ item.hash }}</router-link>
                </el-col>
                <el-col :span="8" class="text-ellipsis">{{ item.amount }}</el-col>
              </el-row>
            </ul>
            <div class="pagination-container">
              <el-pagination
                @size-change="userUpdateList"
                @current-change="userUpdateList"
                :current-page.sync="page"
                :page-size.sync="pageSize"
                :page-sizes="[10, 20, 30, 40]"
                layout="total,sizes,prev, pager, next, jumper"
                :total="listData.total"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </section>
    </template>
  </div>
</template>

<script>
import PageBreadcrumb from '@/components/PageBreadcrumb'
import ParameterRow from '@/components/ParameterRow'
import * as chainApi from '../common/chain-api.js'

export default {
  components: {
    PageBreadcrumb,
    ParameterRow,
  },
  data() {
    return {
      activeTab: 0,
      info: null,
      page: 1,
      pageSize: 20,
      listData: null,
      bancorTokenParams: {},
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
      return this.$t('Token.title')
    },
    strTokenName() {
      return this.$t('Token.tokenName')
    },
    strTokenType() {
      return this.$t('Token.tokenType')
    },
    strSmart() {
      return this.$t('Token.smart')
    },
    strSystem() {
      return this.$t('Token.system')
    },
    strNormal() {
      return this.$t('Token.normal')
    },
    strFactor() {
      return this.$t('Token.factor')
    },
    strCirculation() {
      return this.$t('Token.circulation')
    },
    strNonliquidity() {
      return this.$t('Token.nonliquidity')
    },
    strSupplyTotal() {
      return this.$t('Token.supplyTotal')
    },
    strReserve() {
      return this.$t('Token.reserve')
    },
    strHolding() {
      return this.$t('Token.holding')
    },
    strPrecision() {
      return this.$t('Token.precision')
    },
    strCreateTime() {
      return this.$t('Token.createTime')
    },
    strCreateAccount() {
      return this.$t('Token.createAccount')
    },
    strHoldingAccount() {
      return this.$t('Token.holdingAccount')
    },
    strAccount() {
      return this.$t('Token.account')
    },
    strAmount() {
      return this.$t('Token.amount')
    },
  },
  methods: {
    async update() {
      this.$_APP.loading = true
      const promise1 = chainApi
        .getTokenInfo(this.$route.params.tokenName)
        .then((res) => {
          this.info = res
          if (res.type === 'bancor') {
            return chainApi
              .getBancorTokenParams(this.$route.params.tokenName)
              .then((res2) => {
                this.bancorTokenParams = res2
              })
          }
        })
      const promise2 = this.updateList()
      Promise.all([promise1, promise2]).finally(() => {
        this.$_APP.loading = false
      })
    },
    updateList() {
      return chainApi
        .getFortuneRanking({
          token: this.$route.params.tokenName,
          page: this.page,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.listData = res
        })
    },
    userUpdateList() {
      this.$_APP.loading = true
      this.updateList().finally(() => {
        this.$_APP.loading = false
      })
    },
  },
}
</script>
