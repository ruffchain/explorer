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

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
    // color: rgb(253, 226, 226)
    // color: rgb(185, 245, 204)
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
}
</style>

<template>
  <div class="subscribed-user">
    <section>
      <h2>{{ value }} RUFF</h2>
      <el-alert :closable="false" :title="strAlert" type="info" show-icon>
      </el-alert>
      <el-form
        ref="form"
        :inline="false"
        :model="formData"
        :rules="formRules"
        label-width="150px"
      >
        <el-form-item
          type="text"
          maxlength="32"
          prop="toUsdt"
          :label="strToUsdt"
        >
          <el-input type="text" v-model="formData.toUsdt" minlength="30">
          </el-input>
        </el-form-item>
        <el-form-item prop="amount" :rules="amountRules" :label="strAmount">
          <el-input v-model="formData.amount" type="number"> </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="txLoading"
            type="primary"
            @click="confirm()"
            style="width:100%;"
          >
            {{ strTxConfirm }}
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <TransactionResult v-if="result" :data="result" />
    <!-- 展示表格 -->
    <LoadingContainer :loading="loading">
      <div>
        <el-table
          :data="dataCashbacks"
          highlight-current-row
          @current-change="handleCurrentCashback"
          :row-class-name="cashbackRowClassName"
          :row-style="selectedTxStyle"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="Ruff Tx:">
                  <span>{{ props.row.ruffTx }}</span>
                </el-form-item>
                <el-form-item label="Exchange Amount:">
                  <span>{{ props.row.foreignValue }}</span>
                </el-form-item>
                <el-form-item v-if="props.row.foreignTx" label="Heco TxHash:">
                  <span>{{ props.row.foreignTx }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="date" :label="strTableDate" width="150">
          </el-table-column>
          <el-table-column prop="foreignAddr" :label="strTableAddr" width="400">
          </el-table-column>
          <el-table-column prop="value" :label="strTableAmount" width="150">
          </el-table-column>
          <el-table-column prop="status" :label="strTableStatus">
          </el-table-column>
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
    <AppDialog
      :title="token"
      @cleanForm="cleanTable(), (apploading = false)"
      v-if="apploading"
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
import { genTransferTx } from '../wallet-helper'
import { TokenType } from '../../../../common/enums'
import AppDialog from '../../../../components/AppDialog'

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
    AppDialog
  },
  data() {
    return {
      name: '',
      loading: false,
      strAlert: 'RUFF -> Heco',
      cashbacks: { total: 0, data: [] },
      currentRowCashback: 0,
      page: 1,
      pageSize: 3,
      formData: {
        toUsdt: '',
        amount: ''
      },
      formRules: {},
      result: null,
      txLoading: false,
      showConfirmTx: false,
      txData: {},
      apploading: false
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
          status: this.getStrStatus(record),
          ruffTx: record.ruffTx,
          foreignTx: record.foreignTx,
          foreignValue: record.foreignValue,
          type: record.type,
        })
      }
      return out
    },
    strToUsdt() {
      return 'Heco Address'
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
    },
    strTableDate() {
      return this.$t('Mintage.date')
    },
    strTableAddr() {
      return this.$t('Mintage.address')
    },
    strTableAmount() {
      return this.$t('Mintage.amount')
    },
    strTableSent() {
      return this.$t('Mintage.sent')
    },
    strTableHandled() {
      return this.$t('Mintage.handled')
    },
    strTableStatus() {
      return this.$t('Mintage.status')
    }
  },
  beforeMount() {
    // console.log('value:', this.value)
    const required = rules.required()
    const gt0 = rules.greaterThan(0)

    this.formRules = {
      amount: [required, gt0, rules.amountTooBig()]
    }

    this.updateCashbacks()
  },
  methods: {
    getStrStatus(record) {
      if(record.type === 0){
        return 'Checking'
      }else if(record.type === 1){
        return 'Valid'
      }else if(record.type === 2){
        return 'Accepted'
      }else if(record.type === 3){
          return 'Completed'
      }else if(record.type === 10){
          return 'Rejected'
      }else{
        return ''
      }

    },
    getAuthNormal(txHash) {
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
    async updateValue() {
      try {
        let privateKey = this.$_APP.privateKey
        let address = chainLib.addressFromSecretKey(privateKey)
        let tokens = await chainApi.getTokensByAddress(address)
        console.log('tokens:', tokens)
        let token = tokens.find(tok => {
          return tok.token === this.token
        })
        console.log(token)
        this.value = token.value
      } catch (e) {
        console.log(e)
      }
    },
    cleanTable() {
      this.updateCashbacks()
      // this.updateValue(), too late to update token value,
    },
    async confirm() {
      // check
      this.result = null

      if (this.formData.toUsdt.length < 1) {
        this.result = {
          message: 'No usdt address'
        }
        return
      }

      let res = await chainApi.checkHecoAddr(this.formData.toUsdt)

      console.log(res)
      if (res.err !== 0) {
        this.result = {
          message: 'Invalid Heco address'
        }
        return
      }

      this.txData = genTransferTx({
        to: this.mintageAddr,
        tokenId: this.token,
        amount: this.formData.amount + '',
        fee: '0.1',
        tokenType: TokenType.sys
      })

      this.showConfirmTx = true
    },
    async confirmSendTx(tx) {
      try {
        this.apploading = true
        let res = await chainApi.sendTransaction(tx, this.$_APP.privateKey)
        console.log('tx res:')
        console.log(res)

        let messageUpdate = ''
        if (res.confirmed) {
          let res2 = await chainApi.setCashback(
            this.formData.toUsdt,
            this.formData.amount,
            res.tx.hash,
            this.getAuthNormal(res.tx.hash)
          )
          console.log('res2:', res2)
          if (res2.err === 0) {
            messageUpdate = ' , Update OK'
          } else {
            messageUpdate = ' , Update Fail!'
          }
          this.cleanTable()
        }
        this.result = {
          message:
            (res.confirmed ? 'Transaction OK' : 'Transaction Failed') +
            messageUpdate,
          json: res.tx
        }
      } catch (e) {
        this.result = {
          message: 'Error: ' + e
        }
      } finally {
        this.apploading = false
      }
    },
    selectedTxStyle({ row, rowIndex }) {
      let type = this.cashbacks.data[rowIndex].type
      if ( type == 10) {
        return {
          'background-color': 'rgb(253, 226, 226)'
        }
      } else if (type === 2 ) {
        return {
          'background-color': 'rgb(225, 243, 216)'
        }
      } else if (type === 3) {
        return {
          'background-color': 'rgb(216, 245, 225)'
        }
      }
    }
  }
}
</script>
