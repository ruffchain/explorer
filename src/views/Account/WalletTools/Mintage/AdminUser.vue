<style lang="scss" scoped>
.admin-user {
  .el-alert {
    margin: 20px 0;
  }
  ul.tx-list {
    .list-header {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: solid 1px #eee;
    }
    li {
      margin: 5px 0;
    }
    .el-col {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .empty-view {
      display: flex;
      height: 100px;
      align-items: center;
      justify-content: center;
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
  <div class="admin-user">
    <section>
      <h2>管理员页面</h2>
      <div class="top-radio-selecter">
        <el-radio-group size="medium" v-model="action" @change="actionChange">
          <el-radio-button :label="actionPurchase"></el-radio-button>
          <el-radio-button :label="actionCashback"></el-radio-button>
        </el-radio-group>
      </div>
      <el-alert :closable="false" :title="strAlert" type="info" show-icon>
      </el-alert>
      <!-- 展示表格 -->
      <LoadingContainer :loading="loading" v-if="action === actionPurchase">
        <div>
          <ul class="tx-list">
            <el-row class=" list-header" tag="li">
              <el-col :span="5">usdt地址</el-col>
              <el-col :span="5">ruff地址</el-col>
              <el-col :span="4">数量</el-col>
              <el-col :span="3">日期</el-col>
              <el-col :span="2">处理与否</el-col>
              <el-col :span="5">状态</el-col>
            </el-row>
            <template v-if="txs">
              <el-row
                v-for="tx in dataTxs"
                :key="tx.foreignAddr"
                type="flex"
                tag="li"
              >
                <el-col :span="5">
                  <div class="text-ellipsis">
                    {{ tx.foreignAddr }}
                  </div>
                </el-col>
                <el-col :span="5">
                  {{ tx.ruffAddr }}
                </el-col>
                <el-col :span="4">
                  {{ tx.value }}
                </el-col>
                <el-col :span="3">
                    {{ tx.date}}
                </el-col>
                <el-col :span="2">
                  {{ tx.bHandled }}
                </el-col>
                <el-col :span="5">
                  {{ tx.status }}
                </el-col>
              </el-row>
            </template>
          </ul>
          <div class="pagination-container" v-if="txs && txs.total > 0">
            <el-pagination
              @size-change="updateTxs"
              @current-change="updateTxs"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[10, 20]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="txs.total"
            />
          </div>
        </div>
      </LoadingContainer>
      <!-- 展示cashback request表格 -->
      <LoadingContainer :loading="loading" v-if="action === actionCashback">
        <div>
          <ul class="tx-list"></ul>
          <div class="pagination-container" v-if="txs && txs.total > 0">
            <el-pagination
              @size-change="updateTxs"
              @current-change="updateTxs"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[10, 20]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="txs.total"
            />
          </div>
        </div>
      </LoadingContainer>
    </section>
  </div>
</template>

<script>
import LoadingContainer from '@/components/LoadingContainer'

export default {
  props: {
    value: {
      default: 0
    },
    token: {
      default: ''
    }
  },
  components: {
    LoadingContainer
  },
  data() {
    return {
      name: '',
      action: '',
      strAlert: '',
      loading: false,
      txs: null,
      page: 1,
      pageSize: 10
    }
  },
  computed: {
    actionPurchase() {
      return 'purchased'
    },
    actionCashback() {
      return 'cashback'
    },
    strActionPurchase() {
      return '列举换币交易, USDT换' + this.token
    },
    strActionCashback() {
      return this.token + '兑换回USDT'
    },
    dataTxs() {
      return this.txs.data
    }
  },
  beforeMount() {
    console.log('value: ', this.value)
    this.strAlert = this.strActionPurchase
    this.action = this.actionPurchase
  },
  mounted() {
    this.updateTxs()
  },
  methods: {
    actionChange() {
      console.log('change')
      if (this.action === this.actionPurchase) {
        this.strAlert = this.strActionPurchase
      } else {
        this.strAlert = this.strActionCashback
      }
    },
    async updateTxs() {
      this.loading = true
      this.txs = {
        total: 2,
        data: [
          {
            foreignAddr: '1sfsfsdfsdfdff',
            ruffAddr: '10056bbbb434344',
            value: 2000000,
            date: new Date(),
            bHandled: false,
            status: '未经处理'
          },
          {
            foreignAddr: '2fsfsdfsdfdff',
            ruffAddr: '11156bbbb434344',
            value: 2000000,
            date: new Date(),
            bHandled: false,
            status: '未经处理'
          },
          {
            foreignAddr: '3sfsfsdfsdfdff',
            ruffAddr: '1346bbbb434344',
            value: 2000000,
            date: new Date(),
            bHandled: false,
            status: '未经处理'
          },
          {
            foreignAddr: '4sfsfsdfsdfdff',
            ruffAddr: '12356bbbb434344',
            value: 2000000,
            date: new Date(),
            bHandled: false,
            status: '未经处理'
          }
        ]
      }
      this.loading = false
    }
  }
}
</script>
