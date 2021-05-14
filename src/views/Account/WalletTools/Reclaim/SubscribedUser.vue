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
      <h2>Heco: {{ account }}</h2>

      <el-form
        ref="form"
        :inline="false"
        :model="formData"
        :rules="formRules"
        label-width="150px"
      >
        <el-form-item label="MetaMask">
          <el-button
            :disabled="bButtonDisabled"
            :type="metaMaskConnected"
            @click="enableMetaMask()"
          >
            {{ textMetaMask }}
          </el-button>
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

    <ConfirmTx
      :visible.sync="showConfirmTx"
      :tx="txData"
      @confirm="confirmSendTx"
    />
    <AppDialog
      title="RuffToken depositTo()"
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
    AppDialog
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
      apploading: false
    }
  },
  computed: {
    amountRules() {
      return [...this.formRules.amount]
    },
    strTxConfirm() {
      return 'Confirm'
    },
    strAmount() {
      return 'Amount'
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
        ethereum.on('accountsChanged', accountsNew => {
          this.account = accountsNew[0]
          console.log('account: ', this.account)
        })
      } else {
        console.log('Please install MetaMask')
        this.metaMaskConnected = 'danger'
        this.result = {
          message: 'MetaMask未安装'
        }
      }
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
    async confirmSendTx() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        let signer = provider.getSigner()

        this.contract = new ethers.Contract(RuffTokenContract, abi, signer)
        const value = new BigNumber(10).pow(18).times(new BigNumber(this.formData.amount))
        let tx = await this.contract.depositTo(value.toFixed(),this.ruffAddr)
        this.apploading = true
        let receipt = await tx.wait()
        console.log('depositTo receipt:', receipt)

        this.result = {
          message: receipt.status === 1 ? 'Send OK' : 'Send Fail'
        }
      } catch (e) {
        console.log(e)
        this.result = {
          message: 'Error Encountered'
        }
      } finally {
        this.apploading = false
        this.formData.amount = ''
      }
    }
  }
}
</script>
