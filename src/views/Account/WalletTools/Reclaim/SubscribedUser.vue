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
      <el-form
        ref="form"
        :inline="false"
        :model="formData"
        :rules="formRules"
        label-width="150px"
      >
        <el-form-item :label="strWalletStatus">
          <el-button
            :disabled="bButtonDisabled"
            :type="metaMaskConnected"
            @click="enableMetaMask()"
          >
            {{ textMetaMask }}
          </el-button>
        </el-form-item>
        <el-form-item :label="strHecoAddr">
          <el-tag type="info">{{ account }}</el-tag>
        </el-form-item>
        <el-form-item :label="strRuffAmount">
          <el-tag type="info">{{ ruffAmount }}</el-tag>
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

    <LoadingContainer :loading="loading">
      <div>
        <el-table
          :data="dataReclaims"
          highlight-current-row
          @current-change="handleCurrentReclaim"
          :row-style="selectedTxStyle"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form
                label-position="left"
                inline
                class="demo-table-expand"
                label-width="150px"
              >
                <el-form-item :label="strHecoTx">
                  <span>{{ props.row.hecoTx }}</span>
                </el-form-item>
                <el-form-item v-if="props.row.ruffTx" :label="strRuffTx">
                  <span>{{ props.row.ruffTx }}</span>
                </el-form-item>
                <el-form-item :label="strRuffAddr">
                  <span>{{ props.row.ruffAddr }}</span>
                </el-form-item>
                <el-form-item
                  v-if="props.row.exchangeValue"
                  :label="strExchangeValue"
                >
                  <span>{{ props.row.exchangeValue }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="date" :label="strTableDate" width="150">
          </el-table-column>
          <el-table-column prop="hecoAddr" :label="strTableAddr" width="400">
          </el-table-column>
          <el-table-column prop="value" :label="strTableAmount" width="150">
          </el-table-column>
          <el-table-column prop="status" :label="strTableStatus">
          </el-table-column>
        </el-table>
        <div class="pagination-container" v-if="reclaims && reclaims.total > 0">
          <el-pagination
            @size-change="updateReclaims"
            @current-change="updateReclaims"
            :current-page.sync="page"
            :page-size.sync="pageSize"
            :page-sizes="[3, 5, 10]"
            layout="total,sizes,prev,pager,next,jumper"
            :total="reclaims.total"
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
      title="Heco RuffToken depositTo()"
      @cleanForm="cleanTable(), (apploading = false)"
      v-if="apploading"
    />
  </div>
</template>

<script>
import TransactionResult from '../TransactionResult'
import LoadingContainer from '@/components/LoadingContainer'
import * as rules from '../form-rules.js'
import { ethers } from 'ethers'
import { abi } from './RuffTokenAbi'
import ConfirmTx from '../ConfirmTx'
import AppDialog from '../../../../components/AppDialog'
import * as chainApi from '../../../../common/chain-api'
import ParameterRow from '@/components/ParameterRow'
import { getAuthNormal, getDataReclaims } from './utils'

const BigNumber = require('bignumber.js')

const RuffTokenContract = '0x3fb9c619bc31d5e98aeb698cea697f6010f9f8f4'

export default {
  props: {
    ruffAddr: ''
  },
  components: {
    LoadingContainer,
    TransactionResult,
    ConfirmTx,
    AppDialog,
    ParameterRow
  },
  data() {
    return {
      loading: false,
      account: '',
      metaMaskConnected: 'warning',
      // textConnected: '',
      formData: {
        amount: ''
      },
      txLoading: false,
      result: '',
      contract: null,
      bButtonDisabled: true,
      textMetaMask: '',
      txData: {},
      showConfirmTx: false,
      apploading: false,
      // dataReclaims: [],
      reclaims: { total: 0, data: [] },
      page: 1,
      pageSize: 3,
      ruffAmount: '0'
    }
  },
  computed: {
    dataReclaims() {
      return getDataReclaims(this.reclaims.data)
    },
    amountRules() {
      return [...this.formRules.amount]
    },
    strTxConfirm() {
      return this.$t('Reclaim.confirm')
    },
    strAmount() {
      return this.$t('Reclaim.amount')
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
    strTableStatus() {
      return this.$t('Mintage.status')
    },
    strHecoAddr() {
      return this.$t('Reclaim.hecoAddr') + ':'
    },
    strWalletStatus() {
      return this.$t('Reclaim.walletStatus')
    },
    strRuffAmount() {
      return this.$t('Reclaim.ruffAmount')
    },
    strHecoTx() {
      return this.$t('Reclaim.hecoTx')
    },
    strRuffTx() {
      return this.$t('Reclaim.ruffTx')
    },
    strRuffAddr() {
      return this.$t('Reclaim.ruffAddr')
    },
    strExchangeValue() {
      return this.$t('Reclaim.exchangeValue')
    }
  },
  beforeMount() {
    const required = rules.required()
    const gt0 = rules.greaterThan(0)

    this.formRules = {
      amount: [required, gt0, rules.amountTooBig()]
    }
    this.checkMetaMask()
  },
  methods: {
    async checkMetaMask() {
      console.log('Check MetaMask')
      this.textMetaMask = 'Connect MetaMask'
      const that = this;

      if (typeof window.ethereum !== 'undefined') {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts'
        })
        console.log(typeof accounts[0])
        this.account = accounts[0]
        if (this.account) {
          this.metaMaskConnected = 'success'
          console.log('account: ', this.account)
          this.bButtonDisabled = true
          this.textMetaMask = 'MetaMast Connected'
        } else {
          this.bButtonDisabled = false
        }
        await that.getRemainRuff();

        ethereum.on('accountsChanged', async accountsNew => {
          this.account = accountsNew[0]
          console.log('account: ', this.account)
          await that.getRemainRuff()
        })
      } else {
        console.log('Please install MetaMask')
        this.metaMaskConnected = 'danger'
        this.result = {
          message: 'MetaMask未安装'
        }
      }
      await this.updateReclaims()
    },
    async enableMetaMask() {
      console.log('Enable MetaMask')
      this.result = { message: '' }
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts'
        })
        console.log(typeof accounts[0])
        this.account = accounts[0]
        if (this.account) {
          this.metaMaskConnected = 'success'
          console.log('account: ', this.account)
          this.textMetaMask = 'MetaMast Connected'
        }
      }
    },
    async confirm() {
      console.log('confirm()')
      let val = parseFloat(this.formData.amount)
      console.log(val)
      if (val <= 0) {
        this.result = {
          message: 'Invalid amount' + this.formData.amount
        }
        return
      }

      // console.log("num:", ethers.utils.parseEther("0.2").toBigInt())
      this.txData = {
        method: 'depositTo',
        ruffAddr: this.ruffAddr,
        value: val
      }
      this.showConfirmTx = true
    },
    async getRemainRuff(){
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        let signer = provider.getSigner()

        this.contract = new ethers.Contract(RuffTokenContract, abi, signer)
        let amount = await this.contract.balanceOf(this.account)
        // console.log("amount:", amount)
        if(amount){
          this.ruffAmount = new BigNumber(amount.toString());
          this.ruffAmount = this.ruffAmount.div(new BigNumber(10).pow(18)).toFixed(3);
        }else{
          this.ruffAmount = '0'
        }
        // console.log("ruffAmount:", this.ruffAmount)
    },
    async confirmSendTx() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        let signer = provider.getSigner()

        this.contract = new ethers.Contract(RuffTokenContract, abi, signer)
        const value = new BigNumber(10)
          .pow(18)
          .times(new BigNumber(this.formData.amount))
        let tx = await this.contract.depositTo(value.toFixed(), this.ruffAddr)
        this.apploading = true
        let receipt = await tx.wait()
        console.log('depositTo receipt:', receipt)

        this.result = {
          message: receipt.status === 1 ? 'Send OK' : 'Send Fail'
        }
        console.log('status:', receipt.status)
        if (receipt.status === 1) {
          chainApi
            .setReclaim(
              receipt.blockNumber,
              this.account,
              this.formData.amount,
              '',
              receipt.transactionHash,
              getAuthNormal(this.$_APP.privateKey)
            )
            .then(res => {
              console.log(res)
              this.result = {
                message:
                  res.err === 0
                    ? this.result.message + ' Send Request OK'
                    : this.result.message + ' Send Request Fail'
              }
              this.updateReclaims()
            })
        }
      } catch (e) {
        console.log(e)
        this.result = {
          message: 'Error Encountered'
        }
      } finally {
        await this.getRemainRuff();
        this.apploading = false
       
      }
    },
    handleCurrentReclaim() {
      console.log('current row changed')
    },
    selectedTxStyle({ row, rowIndex }) {
      let type = this.reclaims.data[rowIndex].type
      if (type == 10) {
        return {
          'background-color': 'rgb(253, 226, 226)'
        }
      }
    },
    async updateReclaims() {
      this.loading = true

      chainApi
        .getReclaimsByAddr(
          this.page - 1,
          this.pageSize,
          getAuthNormal(this.$_APP.privateKey)
        )
        .then(res => {
          console.log(res)
          if (res.err === 0) {
            this.reclaims.total = res.data.page_total
            this.reclaims.data = res.data.data
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
