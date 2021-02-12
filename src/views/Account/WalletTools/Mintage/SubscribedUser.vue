<style lang="scss" scoped>
.subscribed-user {
  .el-alert {
    margin: 20px 0;
  }
  flex: 1;
}
</style>

<template>
  <div class="subscribed-user">
    <section>
      <h2>Subscribed user page: {{ value }} {{ strToken }}</h2>
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
          <el-table-column prop="date" label="日期" width="150">
          </el-table-column>
          <el-table-column prop="foreignAddr" label="USDT地址">
          </el-table-column>
          <el-table-column prop="value" label="数量" width="80">
          </el-table-column>
          <el-table-column prop="bHandled" label="处理" width="100">
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
            :page-sizes="[10, 20]"
            layout="total,sizes,prev,pager,next,jumper"
            :total="cashbacks.total"
          />
        </div>
      </div>
    </LoadingContainer>
  </div>
</template>

<script>
import TransactionResult from '../TransactionResult'
import LoadingContainer from '@/components/LoadingContainer'
import * as rules from '../form-rules.js'

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
    LoadingContainer,
    TransactionResult
  },
  data() {
    return {
      name: '',
      loading: false,
      strAlert: '将' + this.token + '兑换成USDT',
      cashbacks: null,
      currentRowCashback: 0,
      page: 1,
      pageSize: 10,
      formData: {
        toUsdt: '',
        amount: ''
      },
      formRules: {},
      result: "let's go",
      txLoading: false
    }
  },
  computed: {
    strToken() {
      return this.token
    },
    dataCashbacks() {
      return this.cashbacks.data
    },
    strToUsdt() {
      return 'USDT Address'
    },
    strAmount() {
      return 'Amount'
    },
    amountRules() {
      let maxDecimalCount = rules.maxDecimalCount(9)

      return [...this.formRules.amount, maxDecimalCount]
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
    async updateCashbacks() {
      this.loading = true

      this.cashbacks = {
        total: 1,
        data: [
          {
            foreignAddr: '0xB8001C3eC9AA1985f6c747E25c28324E4A361ec1',
            value: 234234,
            date: '2021-02-09 13:17',
            bHandled: 'false',
            status: ''
          },
          {
            foreignAddr: '0xB8101C3eC9AA1985f6c747E25c28324E4A361ec1',
            value: 2342500,
            date: '2021-02-10 13:17',
            bHandled: 'false',
            status: ''
          }
        ]
      }

      this.loading = false
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
      this.txLoading = true

      console.log('confirm tx')
      this.txLoading = false
    }
  }
}
</script>
