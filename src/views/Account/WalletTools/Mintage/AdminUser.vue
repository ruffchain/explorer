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
  .el-table {
    .warning-row {
    background: rgb(231, 11, 22);
  }
  .success-row {
    background: #da9619;
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
          <el-table
            :data="dataTxs"
            highlight-current-row
            @current-change="handleCurrentTx"
            :row-class-name="txRowClassName"
            style="width: 100%"
          >
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="foreignAddr" label="USDT地址">
            </el-table-column>
            <el-table-column prop="ruffAddr" label="RUFF地址">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="80">
            </el-table-column>
            <el-table-column prop="bHandled" label="处理" width="100">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
          </el-table>
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
          <!-- button -->
          <div style="margin-top: 20px">
    <el-button @click="hanldeTx">Handle Request</el-button>
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
      cashbacks: null,
      currentRowTx: 0
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
    dataCashbacks() {
      return this.cashbacks.data
    }
  },
  beforeMount() {
    console.log('value: ', this.value)
    this.strAlert = this.strActionPurchase
    this.action = this.actionPurchase

    this.updateTxs()
  },
  mounted() {},
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
            ruffAddr: '124anBEm6dMzAQDoS3Zp91sQ3HiRu6zwJ2',
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            value: 234234,
            date: '2021-02-09 13:17',
            bHandled: 'false',
            status: ''
          },
          {
            ruffAddr: '124anBEm6dMzAQDoS3Zp91sQ3HiRu6zwJ2',
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            value: 234234,
            date: '2021-03-09 13:17',
            bHandled: 'false',
            status: ''
          }
        ]
      }

      this.loading = false
    },
    async updateTxs() {
      this.loading = true
      this.txs = {
        total: 1,
        data: [
          {
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            ruffAddr: '124anBEm6dMzAQDoS3Zp91sQ3HiRu6zwJ2',
            value: 2000001,
            date: '2021-02-09 13:16',
            bHandled: 'false',
            status: '未经处理'
          },
          {
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            ruffAddr: 'ruff124anBEm6dMzAQDoS3Zp91sQ3HiRu6zwJ2',
            value: 2000002,
            date: '2021-02-09 13:17',
            bHandled: 'false',
            status: '未经处理'
          },
          {
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            ruffAddr: '124anBEm6dMzAQDoS3Zp91sQ3HiRu6zwJ2',
            value: 2000003,
            date: '2021-02-09 13:17',
            bHandled: 'false',
            status: '未经处理'
          },
          {
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            ruffAddr: '124anBEm6dMzAQDoS3Zp91sQ3HiRu6zwJ2',
            value: 2000004,
            date: '2021-02-09 13:17',
            bHandled: 'false',
            status: '未经处理'
          }
        ]
      }
      this.loading = false
    },
    handleCurrentTx(val) {
      this.currentRowTx = val
      console.log(this.currentRowTx)
    },
    hanldeTx(){
      console.log('hanleTx()')
    },
    txRowClassName({row, rowIndex}){
      // if(this.dataTxs[row].bHandled === 'false'){
      //   return 'warning-row';
      // }else{
      //   return 'success-row';
      // }
      if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
    }
  }
}
</script>
