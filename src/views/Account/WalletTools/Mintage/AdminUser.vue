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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
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
      <el-alert :closable="false" :title="strAlert" type="info" show-icon>
      </el-alert>
      <div class="top-radio-selecter">
        <el-radio-group size="medium" v-model="action" @change="actionChange">
          <el-radio-button :label="actionInvalid"></el-radio-button>
          <el-radio-button :label="actionValid"></el-radio-button>
          <el-radio-button :label="actionAccepted"></el-radio-button>
          <el-radio-button :label="actionCompleted"></el-radio-button>
          <el-radio-button :label="actionRejected"></el-radio-button>
        </el-radio-group>
      </div>

      <!-- 展示表格 -->
      <LoadingContainer :loading="loading" v-if="action === actionInvalid">
        <div>
          <el-table
            :data="dataCashbacks"
            highlight-current-row
            :row-class-name="txRowClassName"
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
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="foreignAddr" label="Heco地址" width="400">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="150">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
          </el-table>
          <div
            class="pagination-container"
            v-if="cashbacks && cashbacks.total > 0"
          >
            <el-pagination
              @size-change="updateInvalidCashback"
              @current-change="updateInvalidCashback"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[5, 10]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="cashbacks.total"
            />
          </div>
        </div>
      </LoadingContainer>
      <!-- 展示cashback request表格 -->
      <LoadingContainer :loading="loading" v-if="action === actionValid">
        <div>
          <el-table
            :data="dataCashbacks"
            highlight-current-row
            :row-class-name="cashbackRowClassName"
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="Ruff Addr:">
                    <span>{{ props.row.ruffAddr }}</span>
                  </el-form-item>
                  <el-form-item label="Ruff Tx:">
                    <span>{{ props.row.ruffTx }}</span>
                  </el-form-item>
                  <el-form-item label="Exchange Amount:">
                    <span>{{ props.row.foreignValue }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.foreignTx" label="Heco TxHash:">
                    <span>{{ props.row.foreignTx }}</span>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      size="normal"
                      type="danger"
                      @click="handleValid(props.$index)"
                      >批准</el-button
                    >
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="foreignAddr" label="Heco地址" width="400">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="150">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
          </el-table>
          <div
            class="pagination-container"
            v-if="cashbacks && cashbacks.total > 0"
          >
            <el-pagination
              @size-change="updateValidCashback"
              @current-change="updateValidCashback"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[5, 10]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="cashbacks.total"
            />
          </div>
          <!-- button -->
        </div>
      </LoadingContainer>

      <!-- accepted -->
      <LoadingContainer :loading="loading" v-if="action === actionAccepted">
        <div>
          <el-table
            :data="dataCashbacks"
            highlight-current-row
            :row-class-name="cashbackRowClassName"
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="Ruff Addr:">
                    <span>{{ props.row.ruffAddr }}</span>
                  </el-form-item>
                  <el-form-item label="Ruff Tx:">
                    <span>{{ props.row.ruffTx }}</span>
                  </el-form-item>
                  <el-form-item label="Exchange Amount:">
                    <span>{{ props.row.foreignValue }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.foreignTx" label="Heco TxHash:">
                    <span>{{ props.row.foreignTx }}</span>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      size="normal"
                      type="danger"
                      @click="handleAccepted(props.$index)"
                      >更新</el-button
                    >
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="foreignAddr" label="Heco地址" width="400">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="150">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
          </el-table>
          <div
            class="pagination-container"
            v-if="cashbacks && cashbacks.total > 0"
          >
            <el-pagination
              @size-change="updateAcceptedCashback"
              @current-change="updateAcceptedCashback"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[5, 10]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="cashbacks.total"
            />
          </div>
          <!-- button -->
        </div>
      </LoadingContainer>

      <el-dialog
        title="设置HecoTxHash"
        :visible="hecoTxDialogVisible"
        @update:visible="hecoTxClose"
        width="600px"
      >
        <el-form>
          <el-form-item>
            <el-input
              type="text"
              v-model="currentHecoTx"
              style="width:100%"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="default" @click="hecoTxClose">取消</el-button>
          <el-button type="primary" @click="hecoTxConfirm">确认</el-button>
        </div>
      </el-dialog>

      <!-- completed -->
      <LoadingContainer :loading="loading" v-if="action === actionCompleted">
        <div>
          <el-table
            :data="dataCashbacks"
            highlight-current-row
            :row-class-name="cashbackRowClassName"
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="Type:">
                    <span>{{ props.row.type }}</span>
                  </el-form-item>
                  <el-form-item label="Ruff Addr:">
                    <span>{{ props.row.ruffAddr }}</span>
                  </el-form-item>
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
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="foreignAddr" label="Heco地址" width="400">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="150">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
          </el-table>
          <div
            class="pagination-container"
            v-if="cashbacks && cashbacks.total > 0"
          >
            <el-pagination
              @size-change="updateCompletedCashback"
              @current-change="updateCompletedCashback"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[5, 10]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="cashbacks.total"
            />
          </div>
          <!-- button -->
        </div>
      </LoadingContainer>
      <!-- rejected -->
      <LoadingContainer :loading="loading" v-if="action === actionRejected">
        <div>
          <el-table
            :data="dataCashbacks"
            highlight-current-row
            :row-class-name="cashbackRowClassName"
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="Ruff Addr:">
                    <span>{{ props.row.ruffAddr }}</span>
                  </el-form-item>
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
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="foreignAddr" label="Heco地址" width="400">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="150">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
          </el-table>
          <div
            class="pagination-container"
            v-if="cashbacks && cashbacks.total > 0"
          >
            <el-pagination
              @size-change="updateRejectedCashback"
              @current-change="updateRejectedCashback"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[5, 10]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="cashbacks.total"
            />
          </div>
          <!-- button -->
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
// import { genTransferTx } from '../wallet-helper'
// import { TokenType } from '../../../../common/enums'
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
      apploading: false,
      currentRuffTx:'',
      currentHecoTx: '',
      currentHecoValue: '',
      hecoTxDialogVisible: false
    }
  },
  computed: {
    actionInvalid() {
      return 'invalid'
    },
    actionValid() {
      return 'valid'
    },
    actionAccepted() {
      return 'accepted'
    },
    actionCompleted() {
      return 'completed'
    },
    actionRejected() {
      return 'rejected'
    },
    strActionInvalid() {
      return '管理员页面: ' + '用户提交的未验证的请求'
    },
    strActionValid() {
      return '管理员页面: ' + '已验证有效的请求'
    },
    strActionAccepted() {
      return '管理员页面: ' + '已批准的请求'
    },
    strActionCompleted() {
      return '管理员页面: ' + '已完成的请求'
    },
    strActionRejected() {
      return '管理员页面: ' + '被驳回的请求'
    },
    dataCashbacks() {
      let out = []
      let i = 0
      for (let record of this.cashbacks.data) {
        out.push({
          index: i++,
          date: this.getStrDate(record.date),
          ruffAddr: 'ruff' + record.ruffAddr,
          foreignAddr: record.foreignAddr,
          value: record.value,
          sent: record.foreignValue,
          bHandled: this.getStrHandled(record.bHandled),
          status: this.getStrStatus(record),
          ruffTx: record.ruffTx,
          foreignTx: record.foreignTx,
          foreignValue: record.foreignValue,
          type: record.type
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
    this.strAlert = this.strActionInvalid
    this.action = this.actionInvalid

    // this.updateCashbacks()
    this.updateInvalidCashback()
  },
  mounted() {},
  methods: {
    updateInvalidCashback() {
      this.loading = true
      console.log('invalid cashback' + this.page + ' ' + this.pageSize)

      chainApi
        .getInvalidCashback(this.page - 1, this.pageSize, this.getAuth())
        .then(res => {
          console.log('getInvalidCashback')
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
    updateValidCashback() {
      this.loading = true
      console.log('valid cashback' + this.page + ' ' + this.pageSize)

      chainApi
        .getValidCashback(this.page - 1, this.pageSize, this.getAuth())
        .then(res => {
          console.log('getValidCashback')
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
    updateAcceptedCashback() {
      this.loading = true
      console.log('accepted cashback' + this.page + ' ' + this.pageSize)

      chainApi
        .getAcceptedCashback(this.page - 1, this.pageSize, this.getAuth())
        .then(res => {
          console.log('getAcceptedCashback')
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
    updateCompletedCashback() {
      this.loading = true
      console.log('completed cashback' + this.page + ' ' + this.pageSize)

      chainApi
        .getCompletedCashback(this.page - 1, this.pageSize, this.getAuth())
        .then(res => {
          console.log('getCompletedCashback')
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
    updateRejectedCashback() {
      this.loading = true
      console.log('rejected cashback' + this.page + ' ' + this.pageSize)

      chainApi
        .getRejectedCashback(this.page - 1, this.pageSize, this.getAuth())
        .then(res => {
          console.log('getRejectedCashback')
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

    async handleValid(index) {
      // console.log(index)
      console.log(this.dataCashbacks[index].ruffTx)
      this.loading = true

      // update db
      chainApi
        .acceptCashback(this.dataCashbacks[index].ruffTx, this.getAuth())
        .then(res => {
          console.log(res)
        })
        .finally(() => {
          this.loading = false
          console.log('done')
          this.updateValidCashback()
        })
    },
    async handleAccepted(index) {
      console.log(
        this.dataCashbacks[index].ruffTx,
        this.dataCashbacks[index].value
      )
      this.currentRuffTx = this.dataCashbacks[index].ruffTx
      this.currentHecoValue = this.dataCashbacks[index].value
      this.currentHecoTx = ''

      this.hecoTxDialogVisible = true
    },
    hecoTxClose() {
      this.hecoTxDialogVisible = false
    },
    hecoTxConfirm() {
      this.loading = true;
      console.log(this.currentHecoTx, this.currentHecoValue)
      this.hecoTxDialogVisible = false

      console.log('hecoTxConfirm')
      chainApi
        .completeCashback(this.currentRuffTx,this.currentHecoTx, 
        this.currentHecoValue ,this.getAuth())
        .then(res =>{
          console.log('completeCashback')
          console.log(res)
          if(res.err === 0){
            this.updateAcceptedCashback();
          }
        })
        .finally(()=>{
          this.loading = false;
          this.hecoTxDialogVisible = false
        })
    },
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
      if (record.type === 0) {
        return 'Checking'
      } else if (record.type === 1) {
        return 'Valid'
      } else if (record.type === 2) {
        return 'Accepted'
      } else if (record.type === 3) {
        return 'Completed'
      } else if (record.type === 10) {
        return 'Rejected'
      } else {
        return ''
      }
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

      if (this.action === this.actionInvalid) {
        this.strAlert = this.strActionInvalid
        this.updateInvalidCashback()
        this.page = 1
        // this.updateTxs()
        // this.currentRowTx = null
      } else if (this.action === this.actionValid) {
        this.strAlert = this.strActionValid
        this.updateValidCashback()
        this.page = 1
      } else if (this.action === this.actionAccepted) {
        this.strAlert = this.strActionAccepted
        this.updateAcceptedCashback()
        this.page = 1
      } else if (this.action === this.actionCompleted) {
        this.strAlert = this.strActionCompleted
        this.updateCompletedCashback()
        this.page = 1
      } else if (this.action === this.actionRejected) {
        this.strAlert = this.strActionRejected
        this.updateRejectedCashback()
        this.page = 1
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

    txRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
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
        if (res.err === 0) {
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
