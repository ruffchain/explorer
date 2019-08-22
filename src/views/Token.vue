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
    <PageBreadcrumb title="Token详情" />
    <template v-if="info">
      <section class="card">
        <ParameterRow name="Token名称:"> {{ info.name }} </ParameterRow>
        <ParameterRow name="Token类型:">
          {{
            info.type === 'bancor'
              ? '智能'
              : info.type === 'sys'
              ? '系统'
              : '普通'
          }}
          Token
        </ParameterRow>
        <template v-if="info.type === 'bancor'">
          <ParameterRow name="准备金率:">
            {{ info.content.factor }}
          </ParameterRow>
          <ParameterRow name="初始发行量:">
            {{ info.content.supply }}
          </ParameterRow>
          <ParameterRow name="流通发行量:">
            {{ info.content.nonliquidity }}
          </ParameterRow>
          <ParameterRow name="发行总量:">
            {{ -(-info.content.supply - info.content.nonliquidity) }}
          </ParameterRow>
          <ParameterRow name="当前准备金量:">
            {{ bancorTokenParams.R }}
          </ParameterRow>
          <ParameterRow name="当前账户持有量:">
            {{ bancorTokenParams.S }}
          </ParameterRow>
        </template>
        <template v-else>
          <ParameterRow name="发行总量:">
            {{ info.content.supply }}
          </ParameterRow>
          <ParameterRow name="Token精度:">
            {{ info.content.precision }}
          </ParameterRow>
        </template>
        <ParameterRow v-if="info.timestamp" name="创建时间:">
          {{ info.timestamp | ms | dateformat('YYYY-MM-DD HH:mm:ss') }}
        </ParameterRow>
        <ParameterRow v-if="info.address != '-'" name="创建账户:">
          <router-link :to="`/address/${info.address}`">
            {{ info.address }}
          </router-link>
        </ParameterRow>
      </section>

      <section v-if="listData" class="card" style="margin:10px 0">
        <el-tabs v-model="activeTab" style="margin-top:-5px">
          <el-tab-pane label="持有账户" name="0">
            <ul class="data-list">
              <el-row class="text-center list-header" tag="li">
                <el-col :span="16">账户</el-col>
                <el-col :span="8">数量</el-col>
              </el-row>
              <el-row
                v-for="item in listData.data"
                :key="item.address"
                type="flex"
                tag="li"
                class="text-center list-row"
              >
                <el-col :span="16" class="text-ellipsis">
                  <router-link :to="`/address/${item.hash}`">
                    {{ item.hash }}
                  </router-link>
                </el-col>
                <el-col :span="8" class="text-ellipsis">
                  {{ item.value }}
                </el-col>
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
    ParameterRow
  },
  data() {
    return {
      activeTab: 0,
      info: null,
      page: 1,
      pageSize: 20,
      listData: null,
      bancorTokenParams: {}
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
      const promise1 = chainApi
        .getTokenInfo(this.$route.params.tokenName)
        .then(res => {
          this.info = res
          if (res.type === 'bancor') {
            return chainApi
              .getBancorTokenParams(this.$route.params.tokenName)
              .then(res2 => {
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
          pageSize: this.pageSize
        })
        .then(res => {
          this.listData = res
        })
    },
    userUpdateList() {
      this.$_APP.loading = true
      this.updateList().finally(() => {
        this.$_APP.loading = false
      })
    }
  }
}
</script>
