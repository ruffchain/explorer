<style lang="scss" scoped>
.admin-user {
  .el-alert {
    margin: 20px 0;
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}

.warning-row {
  color: red;
  background: rgb(231, 11, 22);
}
.success-row {
  color: brown;
  background: #da9619;
}
</style>

<template>
  <div class="admin-user">
    <section>
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
          <el-table
            type="index"
            :data="dataTxs"
            highlight-current-row
            @current-change="handleCurrentTx"
            :row-class-name="txRowClassName"
            :row-style="selectedTxStyle"
            style="width: 100%"
          >
            <el-table-column prop="index" label="" width="20"></el-table-column>
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="foreignAddr" label="USDT地址">
            </el-table-column>
            <el-table-column prop="ruffAddr" label="RUFF地址">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="120">
            </el-table-column>
            <el-table-column prop="sent" label="兑换" width="120">
            </el-table-column>
            <el-table-column prop="bHandled" label="处理" width="50">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
          </el-table>
          <div class="pagination-container" v-if="txs && txs.total > 0">
            <el-pagination
              @size-change="updateTxs"
              @current-change="updateTxs"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[5, 10]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="txs.total"
            />
          </div>
          <!-- button -->
          <TransactionResult v-if="result" :data="result" />
          <div style="margin-top: 20px">
            <el-form
              :inline="true"
              :model="purchased"
              v-if="currentRowTx !== null"
            >
              <el-form-item label="Ratio:">
                <el-input-number
                  v-model="purchased.ratio"
                  :precision="2"
                  :step="0.01"
                  :max="5"
                  :min="0.2"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="Send ">
                <div style="color:red">{{ valPurchased }} {{ token }}</div>
              </el-form-item>
              <el-form-item label="To">
                {{ $_APP.ADDRESS_PREFIX }}{{ addrPurchased }}
              </el-form-item>
              <el-form-item>
                <el-button
                  :disabled="buttonDisabled"
                  type="primary"
                  v-if="action === actionPurchase"
                  @click="hanldeTx"
                  >Confirm</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </LoadingContainer>
      <!-- 展示cashback request表格 -->
      <LoadingContainer :loading="loading" v-if="action === actionCashback">
        <div>
          <el-table
            :data="dataCashbacks"
            highlight-current-row
            @current-change="handleCurrentCashback"
            :row-class-name="cashbackRowClassName"
            :row-style="selectedCashbackStyle"
            style="width: 100%"
          >
            <el-table-column prop="index" label="" width="20"></el-table-column>
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="ruffAddr" label="RUFF地址">
            </el-table-column>
            <el-table-column prop="foreignAddr" label="USDT地址">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="120">
            </el-table-column>
            <el-table-column prop="sent" label="Usdt" width="120">
            </el-table-column>
            <el-table-column prop="bHandled" label="处理" width="80">
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
          <!-- button -->
          <TransactionResult v-if="result" :data="result" />
          <div style="margin-top: 20px">
            <el-form
              :inline="false"
              :model="cashbackModel"
              v-if="currentRowCashback !== null"
              label-width="90px"
            >
              <el-form-item label="USDT:">
                <el-input
                  v-model="cashbackModel.txHash"
                  placeholder="USDT transfer TX hash"
                  v-if="currentRowCashback !== null"
                >
                  <template slot="prepend">Hash</template>
                </el-input>
              </el-form-item>
              <el-form-item label="Ratio:">
                <el-input-number
                  v-model="cashbackModel.ratio"
                  :precision="2"
                  :step="0.01"
                  :max="5"
                  :min="0.2"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="Value:">
                {{ valCashback }}
              </el-form-item>
              <el-form-item label="">
                <el-button
                  type="warning"
                  :disabled="buttonDisabled"
                  @click="handleCashback"
                  >Update Cashback</el-button
                >
              </el-form-item>
            </el-form>

            <!-- <div
              v-if="action === actionCashback && currentRowCashback !== null"
            >
          
                <div style="color:red">{{ valCashback }} USDT</div>

              
            </div> -->
          </div>
        </div>
      </LoadingContainer>
    </section>
    <ConfirmTx
      :visible.sync="showConfirmTx"
      :tx="txData"
      @confirm="confirmSendTx"
    />
    <AppDialog
      :title="token"
      @cleanForm="cleanTxForm(), (apploading = false)"
      v-if="apploading"
    />
  </div>
</template>

<script>
import LoadingContainer from '@/components/LoadingContainer'
import * as chainApi from '../../../../common/chain-api'
import * as chainLib from '../../../../common/chain-lib'
import ConfirmTx from '../ConfirmTx'
import AppDialog from '../../../../components/AppDialog'
import { genTransferTx } from '../wallet-helper'
import { TokenType } from '../../../../common/enums'
import TransactionResult from '../TransactionResult'

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
    ConfirmTx,
    AppDialog,
    TransactionResult
  },
  data() {
    return {
      name: '',
      action: '',
      strAlert: '',
      loading: false,
      txs: {
        total: 1,
        data: []
      },
      page: 1,
      pageSize: 5,
      cashbacks: {
        total: 1,
        data: []
      },
      currentRowTx: null,
      currentRowCashback: null,
      purchased: {
        ratio: 1.0
      },
      cashbackModel: {
        ratio: 1.0,
        txHash: ''
      },
      buttonDisabled: false,
      showConfirmTx: false,
      txData: {},
      result: null,
      apploading: false
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
      return (
        '管理员页面: ' +
        '列举换币交易, USDT换' +
        this.token +
        ', 选择表中的一行，处理换币请求'
      )
    },
    strActionCashback() {
      return (
        '管理员页面: ' + this.token + '兑换回USDT, 选择表中的一行，进行处理'
      )
    },
    dataTxs() {
      // get data from txs.data
      let out = []
      let i = 0
      for (let record of this.txs.data) {
        out.push({
          index: i++,
          date: this.getStrDate(record.date),
          foreignAddr: record.foreignAddr,
          ruffAddr: record.ruffAddr,
          value: record.value,
          sent:
            record.ruffValue === undefined || record.ruffValue === 'undefined'
              ? 0
              : record.ruffValue,
          bHandled: this.getStrHandled(record.bHandled),
          status: this.getStrStatus(record)
        })
      }

      return out
    },
    dataCashbacks() {
      let out = []
      let i = 0
      for (let record of this.cashbacks.data) {
        out.push({
          index: i++,
          date: this.getStrDate(record.date),
          ruffAddr: record.ruffAddr,
          foreignAddr: record.foreignAddr,
          value: record.value,
          sent: record.foreignValue,
          bHandled: this.getStrHandled(record.bHandled),
          status: this.getStrStatus(record)
        })
      }
      return out
    },
    valPurchased() {
      if (this.currentRowTx) {
        let val =
          typeof this.currentRowTx.value === 'string'
            ? parseFloat(this.currentRowTx.value)
            : this.currentRowTx.value
        return Math.round(this.purchased.ratio * val)
      } else {
        return 0
      }
    },
    addrPurchased() {
      if (
        this.currentRowTx &&
        !this.checkTxHandled(this.currentRowTx) &&
        this.checkTxValid(this.currentRowTx)
      ) {
        return this.currentRowTx.ruffAddr
      } else if (this.currentRowTx && this.checkTxHandled(this.currentRowTx)) {
        let index = this.currentRowTx.index
        return '  Done ' + this.txs.data[index].ruffValue + ' sent'
      } else {
        return ''
      }
    },
    valCashback() {
      if (this.currentRowCashback) {
        let val =
          typeof this.currentRowCashback.value === 'string'
            ? parseFloat(this.currentRowCashback.value)
            : this.currentRowCashback.value
        return Math.round(this.cashbackModel.ratio * val)
      } else {
        return 0
      }
    }
  },
  beforeMount() {
    console.log('value: ', this.value)
    this.strAlert = this.strActionPurchase
    this.action = this.actionPurchase

    this.updateTxs()
    this.updateCashbacks()
  },
  mounted() {},
  methods: {
    checkTxHandled(tx) {
      if (this.txs.data[tx.index].bHandled === true) {
        return true
      }
    },
    checkTxValid(tx) {
      if (this.txs.data[tx.index].type === 0) {
        return true
      }
    },
    getStrHandled(bHandled) {
      if (bHandled) {
        return 'Y'
      } else {
        return 'N'
      }
    },
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
    getStrDate(str) {
      try {
        let date = new Date(str)
        return (
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) +
          '-' +
          (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
          ' ' +
          (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
          ':' +
          (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        )
      } catch (e) {
        console.error(e)
        return ''
      }
    },
    getAuth() {
      let privateKey = this.$_APP.privateKey
      let address = chainLib.addressFromSecretKey(privateKey)
      let pubkey = chainLib.publicKeyFromSecretKey(privateKey).toString('hex')

      let num = Math.floor(new Date().getTime() / 1000)

      let hash = chainLib.hash256(Buffer.from(num + ''))

      return {
        date: num, // seconds
        address: address,
        pubkey: pubkey,
        signature: chainLib.sign(hash, privateKey).toString('hex')
      }
    },
    actionChange() {
      console.log('change')

      if (this.action === this.actionPurchase) {
        this.strAlert = this.strActionPurchase
        this.page = 1
        this.updateTxs()
        this.currentRowTx = null
      } else {
        this.strAlert = this.strActionCashback
        this.page = 1
        this.updateCashbacks()
        this.currentRowCashback = null
      }
    },
    async updateCashbacks() {
      this.loading = true
      console.log('cashback this.page: ', this.page, ' ', this.pageSize)

      chainApi
        .getCashback(this.page - 1, this.pageSize, this.getAuth())
        .then(res => {
          console.log('getCashback')
          console.log(res)
          if (res.err === 0) {
            this.pageSize = res.data.page_size
            this.cashbacks.total = res.data.page_total
            this.cashbacks.data = res.data.data
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    async updateTxs() {
      this.loading = true
      console.log('this.page:', this.page, ' ', this.pageSize)

      chainApi
        .getPurchased(this.page - 1, this.pageSize, this.getAuth())
        .then(res => {
          console.log('getPurchased()')
          console.log(res)
          if (res.err === 0) {
            this.pageSize = res.data.page_size
            this.txs.total = res.data.page_total
            this.txs.data = []
            for (let ele of res.data.data) {
              this.txs.data.push(ele)
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCurrentTx(val) {
      if (!val) {
        return
      }
      this.result = null
      this.currentRowTx = val
      console.log(this.currentRowTx)
      let index = this.currentRowTx.index
      if (
        this.txs.data[index].bHandled === true ||
        this.txs.data[index].type !== 0
      ) {
        this.buttonDisabled = true
      } else {
        this.buttonDisabled = false
      }
    },

    txRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    selectedTxStyle({ row, rowIndex }) {
      if (this.txs.data[rowIndex].type !== 0) {
        return {
          'background-color': 'rgb(253, 226, 226)'
        }
      } else if (this.txs.data[rowIndex].bHandled === true) {
        return {
          'background-color': 'rgb(225, 243, 216)'
        }
      } else if (this.txs.data[rowIndex].bAccepted === true) {
        return {
          'background-color': 'rgb(250, 236, 216)'
        }
      }
    },
    selectedCashbackStyle({ row, rowIndex }) {
      if (this.cashbacks.data[rowIndex].type !== 0) {
        return {
          'background-color': 'rgb(253, 226, 226)'
        }
      } else if (this.cashbacks.data[rowIndex].bHandled === true) {
        return {
          'background-color': 'rgb(225, 243, 216)'
        }
      } else if (this.cashbacks.data[rowIndex].bAccepted === true) {
        return {
          'background-color': 'rgb(250, 236, 216)'
        }
      }
    },
    indexTxMethod(index) {
      return index
    },
    cleanTxForm() {
      if (this.action === this.actionPurchase) {
        this.currentRowTx = null
        console.log('cleanTxForm purchased')
        this.updateTxs()
      } else if (this.action === this.actionCashback) {
        this.currentRowCashback = null
        console.log('cleanTxForm cashback')
        this.updateCashbacks()
      } else {
        console.log('cleanTxForm')
        console.log('unknown action')
      }
    },
    hanldeTx() {
      console.log('hanleTx()')
      this.result = null
      this.txData = genTransferTx({
        to: this.addrPurchased,
        tokenId: this.token,
        amount: this.valPurchased + '',
        fee: '0.1',
        tokenType: TokenType.normal
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
          let index = this.currentRowTx.index
          let res2 = await chainApi.updatePurchasedHandled(
            this.txs.data[index].foreignTx,
            res.tx.input.amount,
            res.tx.hash,
            this.getAuth()
          )
          console.log('res2:', res2)

          if (res2.err === 0) {
            messageUpdate = ' ,Update OK'
          } else {
            messageUpdate = ' ,Update Fail'
          }
        }

        this.result = {
          message:
            (res.confirmed ? 'Transaction OK' : 'Transaction Failed') +
            messageUpdate,
          json: res.tx
        }
        if (res.confirmed) {
          this.cleanTxForm()
        }
      } catch (e) {
        this.result = {
          message: 'Error ' + e
        }
      } finally {
        this.apploading = false
      }
    },
    handleCurrentCashback(val) {
      if (!val) return

      this.result = null
      this.currentRowCashback = val
      console.log(this.currentRowCashback)
      let index = this.currentRowCashback.index
      if (
        this.cashbacks.data[index].bHandled === true ||
        this.cashbacks.data[index].type !== 0
      ) {
        this.buttonDisabled = true
      } else {
        this.buttonDisabled = false
      }
    },
    async handleCashback() {
      console.log('handleCashback()')
      this.result = null
      this.apploading = true
      let index = this.currentRowCashback.index

      console.log('index', index)
      console.log(this.cashbacks.data[index])
      let ruffTx = this.cashbacks.data[index].ruffTx
      console.log(ruffTx)


      if (this.cashbackModel.txHash.length < 1) {
        this.result = {
          message: 'Error: Must input TX Hash!'
        }
        this.apploading = false
        return
      }

      try {
        let res = await chainApi.updateCashbackHandled(
          ruffTx,
          this.valCashback,
          this.cashbackModel.txHash,
          this.getAuth()
        )

        console.log(res)
        if(res.err === 0){
          this.result = {
            message: 'Update cashback record OK'
          }
          this.cleanTxForm()
        }
      } catch (e) {
        this.result = {
          message: 'Error:' + e
        }
      } finally {
        this.apploading = false
      }
    },
    cashbackRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>
