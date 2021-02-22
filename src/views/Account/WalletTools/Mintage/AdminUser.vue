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
          <h2>换币请求:</h2>
          <el-table
            type="index"
            :data="dataTxs"
            highlight-current-row
            @current-change="handleCurrentTx"
            :row-class-name="txRowClassName"
            :row-style="selectedTxStyle"
            style="width: 100%"
          >
            <el-table-column prop="index" label="" width="20"
            ></el-table-column>
            <el-table-column prop="date" label="日期" width="150"
            >
            </el-table-column>
            <el-table-column prop="foreignAddr" label="USDT地址">
            </el-table-column>
            <el-table-column prop="ruffAddr" label="RUFF地址">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="120">
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
            <el-form :inline="true" :model="purchased" v-if="currentRowTx!==null">
              <el-form-item label="Ratio:">
                <el-input-number
                  v-model="purchased.ratio"
                  :precision="2"
                  :step="0.01"
                  :max="5"
                  :min="0.5"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="Send ">
                <div style="color:red">{{ valPurchased }} {{ token }} </div>
              </el-form-item>
              <el-form-item label="To">
                {{$_APP.ADDRESS_PREFIX}}{{ addrPurchased }}
              </el-form-item>
              <el-form-item>
                <el-button 
                  :disabled="buttonDisabled"
                  type="primary" 
                  v-if="action === actionPurchase" @click="hanldeTx"
                  >Confirm</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </LoadingContainer>
      <!-- 展示cashback request表格 -->
      <LoadingContainer :loading="loading" v-if="action === actionCashback">
        <div>
          <h2>兑换请求:</h2>
          <el-table
            :data="dataCashbacks"
            highlight-current-row
            @current-change="handleCurrentCashback"
            :row-class-name="cashbackRowClassName"
            style="width: 100%"
          >
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="ruffAddr" label="RUFF地址">
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
              :page-sizes="[5, 10]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="cashbacks.total"
            />
          </div>
          <!-- button -->
          <div style="margin-top: 20px">
            <el-button v-if="action === actionCashback" @click="handleCashback"
              >Handle Cashback</el-button
            >
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
      @cleanForm="cleanTxForm(), (loading = false)"
      v-if="loading"
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
      cashbacks: null,
      currentRowTx: null,
      currentRowCashback: null,
      purchased: {
        ratio: 1.0
      },
      cashback: {
        ratio: 1.0
      },
      buttonDisabled: false,
      showConfirmTx: false,
      txData: {},
      result : null
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
        ', 选择表中的一行，进行处理'
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
      let i= 0
      for (let record of this.txs.data) {
        out.push({
          index: i++,
          date: this.getStrDate(record.date),
          foreignAddr: record.foreignAddr,
          ruffAddr: record.ruffAddr,
          value: record.value,
          bHandled: this.getStrHandled(record.bHandled),
          status: this.getStrStatus(record)
        })
      }

      return out
    },
    dataCashbacks() {
      return this.cashbacks.data
    },
    valPurchased(){
      if(this.currentRowTx){
        let val = (typeof this.currentRowTx.value === 'string')?parseFloat(this.currentRowTx.value):this.currentRowTx.value
        return (this.purchased.ratio * val)
      }else{
        return 0
      }
    },
    addrPurchased(){
      if(this.currentRowTx && !this.checkTxHandled(this.currentRowTx) && this.checkTxValid(this.currentRowTx)){
        return (this.currentRowTx.ruffAddr)
      }else{
        return ''
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
    checkTxHandled(tx){
      if(this.txs.data[tx.index].bHandled === true){
        return true
      }

    },
    checkTxValid(tx){
      if(this.txs.data[tx.index].type === 0){
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

      let num = Math.floor(new Date().getTime() / 1000) - 1

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
    async updateTxs( ) {
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
      if(!val){
        return
      }
      this.result = null
      this.currentRowTx = val
      console.log(this.currentRowTx)
      let index = this.currentRowTx.index
      if( this.txs.data[index].bHandled === true || this.txs.data[index].type !== 0){
        this.buttonDisabled = true
      }else{
        this.buttonDisabled =  false;
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
    selectedTxStyle({row, rowIndex}){
      if(this.txs.data[rowIndex].type !== 0){
        return {
          "background-color": "#F56C6C"
        }
      }else if(this.txs.data[rowIndex].bHandled === true){
        return {
          "background-color": "#67C23A"
        }
      }
    },
    indexTxMethod(index) {
        return index;
      },
    cleanTxForm(){
      this.currentRowTx = null
      this.updateTxs(this.page)
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
    async confirmSendTx(tx){
      try{
        this.loading=true
        let res = await chainApi.sendTransaction(tx, this.$_APP.privateKey)
        this.result = {
          message: res.confirmed?"Transaction OK":"Transaction Failed", json: res.tx
        }
        if(res.confirmed){ this.cleanTxForm()}
      }
      catch(e){
        this.result = {
          message: "Error " + e
        }

      }finally{
        this.loading = false
      }

    
    },
    handleCurrentCashback(val) {
      this.currentRowCashback = val
      console.log(this.currentRowCashback)
    },
    handleCashback() {
      console.log('handleCashback()')
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
