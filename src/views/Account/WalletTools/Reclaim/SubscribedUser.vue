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
          <el-button :type="metaMaskConnected" @click="enableMetaMask()" >
            Connect MetaMask
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
  </div>
</template>

<script>
import TransactionResult from '../TransactionResult'
import LoadingContainer from '@/components/LoadingContainer'
import * as rules from '../form-rules.js'
import { ethers } from 'ethers'
import {abi} from './RuffTokenAbi'
const BigNumber = require('bignumber.js')

export default {
  props: {
    ruffAddr: ''
  },
  components: {
    LoadingContainer,
    TransactionResult,
  },
  data() {
    return {
      loading: false,
      account: '',
      metaMaskConnected: 'warning',
      textConnected: '',
      formData: {
        amount: ''
      },
      txLoading: false,
      result:'',
      contract:null,
    }
  },
  computed: {
    amountRules() {
      // let maxCount = rules.amountOver(this.value)

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
  },
  methods: {
    async enableMetaMask() {
      console.log('Enable MetaMask')
      if (this.metaMaskConnected === 'success') {
        return
      }
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts'
        })
        console.log(typeof accounts[0])
        this.account = accounts[0]
        if (this.account) {
          this.metaMaskConnected = 'success'
          console.log('account: ', this.account)
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
    async confirm() {
      console.log('confirm()')
      const provider = new  ethers.providers.Web3Provider(window.ethereum)
      // this.contract = new ethers.Contract(
      //     "0x3fb9c619bc31d5e98aeb698cea697f6010f9f8f4",
      //     abi,
      //     provider
      //   )
      // let result = await this.contract.decimals()
      // console.log("decimals:", result.toString())
      let signer = provider.getSigner();

      this.contract = new ethers.Contract(
        "0x3fb9c619bc31d5e98aeb698cea697f6010f9f8f4",
        abi,
        signer
      )
      const value = new BigNumber(10).pow(18).times(10.123)
      let tx = await this.contract.transfer("0x9801c7Af4bc83073d41704cd6A33A81975cecF84",value.toFixed());
      let receipt = await tx.wait()
      console.log("transfer:", receipt)
      // console.log("num:", ethers.utils.parseEther("0.2").toBigInt())
    }
  }
}
</script>
