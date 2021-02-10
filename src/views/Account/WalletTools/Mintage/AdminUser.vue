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
            <h2>换币请求:</h2>
          <ul class="tx-list">
            <el-row class=" list-header" tag="li">
              <el-col :span="8">usdt地址</el-col>
              <el-col :span="8">ruff地址</el-col>
              <el-col :span="2">数量</el-col>
              <el-col :span="4">日期</el-col>
              <el-col :span="2">处理与否</el-col>
              <el-col :span="2">状态</el-col>
            </el-row>
            <template v-if="txs">
              <el-row
                v-for="tx in dataTxs"
                :key="tx.foreignAddr"
                type="flex"
                tag="li"
              >
                <el-col :span="8">
                  <div class="text-ellipsis">
                    {{ tx.foreignAddr }}
                  </div>
                </el-col>
                <el-col :span="8">
                  {{ tx.ruffAddr }}
                </el-col>
                <el-col :span="2">
                  {{ tx.value }}
                </el-col>
                <el-col :span="4">
                  {{ tx.date }}
                </el-col>
                <el-col :span="2">
                  {{ tx.bHandled }}
                </el-col>
                <el-col :span="2">
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
          <h2>兑换请求:</h2>
          <ul class="tx-list">
            <el-row class=" list-header" tag="li">
              <el-col :span="5">ruff地址</el-col>
              <el-col :span="5">USDT地址</el-col>
              <el-col :span="4">数量</el-col>
              <el-col :span="3">日期</el-col>
              <el-col :span="2">处理与否</el-col>
              <el-col :span="5">状态</el-col>
            </el-row>
            <template v-if="cashbacks">
              <el-row
                v-for="cashback in dataCashbacks"
                :key="cashback.ruffAddr"
                type="flex"
                tag="li"
              >
                <el-col :span="5">
                  <div class="text-ellipsis">
                    {{ cashback.ruffAddr }}
                  </div>
                </el-col>
                <el-col :span="5">
                  {{ cashback.foreignAddr }}
                </el-col>
                <el-col :span="4">
                  {{ cashback.value }}
                </el-col>
                <el-col :span="3">
                  {{ cashback.date }}
                </el-col>
                <el-col :span="2">
                  {{ cashback.bHandled }}
                </el-col>
                <el-col :span="5">
                  {{ cashback.status }}
                </el-col>
              </el-row>
            </template>
          </ul>
          <div
            class="pagination-container"
            v-if="cashbacks && cashbacks.total > 0"
          >
            <el-pagination
              @size-change="updateCashbacks"
              @current-change="updateCashbacks"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[10, 20]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="cashbacks.total"
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
      pageSize: 10,
      cashbacks: null
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
    },
    dataCashbacks(){
        return this.cashbacks.data
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
        this.updateTxs()
      } else {
        this.strAlert = this.strActionCashback
        this.updateCashbacks()
      }
    },
    async updateCashbacks() {
      this.loading = true
      this.cashbacks = {
        total: 1,
        data: [
          {
            ruffAddr: 'ruff124anBEm6dMzAQDoS3Zp91sQ3HiRu6zwJ2',
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            value: 234234,
            date: '2021-02-09T13:17:26.434Z',
            bHandled: false,
            status: ''
          },
          {
            ruffAddr: 'ruff124anBEm6dMzAQDoS3Zp91sQ3HiRu6zwJ2',
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            value: 234234,
            date: '2021-03-09T13:17:26.434Z',
            bHandled: false,
            status: ''
          }
        ]
      }

      this.loading = false
    },
    async updateTxs() {
      this.loading = true
      this.txs = {
        total: 2,
        data: [
          {
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            ruffAddr: 'ruff124anBEm6dMzAQDoS3Zp91sQ3HiRu6zwJ2',
            value: 2000000,
            date: '2021-02-09T13:16:54.551Z',
            bHandled: false,
            status: '未经处理'
          },
          {
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            ruffAddr: 'ruff124anBEm6dMzAQDoS3Zp91sQ3HiRu6zwJ2',
            value: 2000000,
            date: '2021-02-09T13:17:26.434Z',
            bHandled: false,
            status: '未经处理'
          },
          {
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            ruffAddr: 'ruff124anBEm6dMzAQDoS3Zp91sQ3HiRu6zwJ2',
            value: 2000000,
            date: '2021-02-09T13:17:26.434Z',
            bHandled: false,
            status: '未经处理'
          },
          {
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            ruffAddr: 'ruff124anBEm6dMzAQDoS3Zp91sQ3HiRu6zwJ2',
            value: 2000000,
            date: '2021-02-09T13:17:26.434Z',
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
