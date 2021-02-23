<style lang="scss" scoped>
.subscribed-user {
  .el-alert {
    margin: 20px 0;
  }
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
</style>

<template>
  <div class="subscribed-user">
    <section>
      <h2>Subscribed Users: {{ value }} {{ strToken }}</h2>
      <el-alert :closable="false" :title="strAlert" type="info" show-icon>
      </el-alert>
      <el-form
        ref="form"
        :model="formData"
        :rules="formRules"
        label-width="180px"
      >
        <el-form-item prop="toUsdt" :label="strToUsdt">
          <el-input v-model="formData.toUsdt"> </el-input>
        </el-form-item>
        <el-form-item prop="amount" :rules="amountRules" :label="strAmount">
          <el-input v-model="formData.amount" type="number"> </el-input>
        </el-form-item>
      </el-form>
    </section>
    <TransactionResult v-if="result" :data="result" />
    <el-button
      :loading="txLoading"
      type="primary"
      @click="confirm()"
      style="width:100%;"
    >
      {{ strTxConfirm }}
    </el-button>

    <!-- 展示表格 -->
    <LoadingContainer :loading="loading">
      <div>
        <h2>已提交的换币请求:</h2>
        <el-table
          :data="dataCashbacks"
          highlight-current-row
          @current-change="handleCurrentCashback"
          :row-class-name="cashbackRowClassName"
          style="width: 100%"
        >
          <el-table-column prop="index" label="" width="20"></el-table-column>
          <el-table-column prop="date" label="日期" width="150">
          </el-table-column>
          <el-table-column prop="foreignAddr" label="USDT地址">
          </el-table-column>
          <el-table-column prop="value" label="数量" width="120">
          </el-table-column>
          <el-table-column prop="sent" label="兑换" width="120">
          </el-table-column>
          <el-table-column prop="bHandled" label="处理" width="50">
          </el-table-column>
          <el-table-column prop="status" label="状态"> </el-table-column>
        </el-table>
        <div
          class="pagination-container"
          v-if="cashbacks && cashbacks.total > 0"
        >
          <el-pagination
            @size-change="updateCashbacks"
            @current-change="updateCashbacks"
            :current-page.sync="page"
            :page-size.sync="pageSize"
            :page-sizes="[5, 10]"
            layout="total,sizes,prev,pager,next,jumper"
            :total="cashbacks.total"
          />
        </div>
      </div>
    </LoadingContainer>
    <ConfirmTx
      :visible.sync="showConfirmTx"
      :tx="txData"
      @confirm="confirmSendTx"
    />
  </div>
</template>

<script>
import TransactionResult from '../TransactionResult'
import LoadingContainer from '@/components/LoadingContainer'
import * as rules from '../form-rules.js'
import * as chainApi from '../../../../common/chain-api'
import * as chainLib from '../../../../common/chain-lib'
import ConfirmTx from '../ConfirmTx'
import { getStrDate, getStrHandled } from '../../../../common/utils'

export default {
  props: {
    value: {
      default: 0
    },
    token: {
      default: ''
    },
    mintageAddr: {
      default: ''
    }
  },
  components: {
    LoadingContainer,
    TransactionResult,
    ConfirmTx,
  },
  data() {
    return {
      name: '',
      loading: false,
      strAlert: '将' + this.token + '兑换成USDT',
      cashbacks: { total: 0, data: [] },
      currentRowCashback: 0,
      page: 1,
      pageSize: 5,
      formData: {
        toUsdt: '',
        amount: ''
      },
      formRules: {},
      result: null,
      txLoading: false,
      showConfirmTx: false,
      txData: {}
    }
  },
  computed: {
    strToken() {
      return this.token
    },
    dataCashbacks() {
      // return this.cashbacks.data
      let out = []
      let index = 0
      for (let record of this.cashbacks.data) {
        out.push({
          index: index++,
          date: getStrDate(record.date),
          foreignAddr: record.foreignAddr,
          value: record.value,
          sent: record.foreignValue,
          bHandled: getStrHandled(record.bHandled),
          status: this.getStrStatus(record)
        })
      }
      return out
    },
    strToUsdt() {
      return 'USDT Address'
    },
    strAmount() {
      return 'Amount'
    },
    amountRules() {
      let maxCount = rules.amountOver(this.value)

      return [...this.formRules.amount, maxCount]
    },
    strTxConfirm() {
      return 'Confirm'
    }
  },
  beforeMount() {
    console.log('value:', this.value)
    const required = rules.required()
    const gt0 = rules.greaterThan(0)

    this.formRules = {
      amount: [required, gt0, rules.amountTooBig()]
    }

    this.updateCashbacks()
  },
  methods: {
    getStrStatus(record) {
      let out = ''
      if (record.type === 0) {
        out += 'Valid'
        if (record.bHandled === true) {
          out += ',processed'
        } else {
          out += ',unprocessed'
        }
      } else {
        out += 'Invalid'
      }
      return out
    },
    getAuthNormal() {
      let privateKey = this.$_APP.privateKey
      let address = chainLib.addressFromSecretKey(privateKey)
      let pubkey = chainLib.publicKeyFromSecretKey(privateKey).toString('hex')

      let num = Math.floor(new Date().getTime() / 1000) - 1

      let hash = chainLib.hash256(Buffer.from(num + ''))

      return {
        date: num, // seconds
        address: address,
        pubkey: pubkey,
        signature: chainLib.sign(hash, privateKey).toString('hex')
      }
    },
    async updateCashbacks() {
      this.loading = true
      console.log('page :', this.page, 'pagesize:', this.pageSize)
      chainApi
        .getCashbackByAddr(this.page - 1, this.pageSize, this.getAuthNormal())
        .then(res => {
          console.log('getCashbackByAddr()')
          console.log(res)
          if (res.err === 0) {
            this.cashbacks.total = res.data.page_total
            this.cashbacks.data = res.data.data
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCurrentCashback(val) {
      this.currentRowCashback = val
      console.log(this.currentRowCashback)
    },
    cashbackRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    async confirm() {
      this.showConfirmTx = true

      console.log('confirm tx')
      this.showConfirmTx = false
    },
    async confirmSendTx(tx) {



    }
  }
}
</script>
