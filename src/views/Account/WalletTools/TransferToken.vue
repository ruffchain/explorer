<style lang="scss" scoped>
.transfer-token {
  .el-alert {
    margin: 20px 0;
  }
}
</style>

<template>
  <div class="transfer-token">
    <section>
      <div class="top-radio-selecter">
        <el-radio-group size="mini" v-model="sendTokenType" @change="typeChange">
          <el-radio-button v-for="item in tokenTypes" :key="item" :label="item"></el-radio-button>
        </el-radio-group>
      </div>
      <el-alert
        v-if="sendTokenType === TokenType.smart"
        :closable="false"
        :title="`智能Token是以${$_APP.CORE_SYMBOL} Token作为准备金发行的，支持Bancor协议流通兑换的Token`"
        type="info"
        show-icon
      ></el-alert>
      <el-form ref="form" :model="formData" :rules="formRules" label-width="90px">
        <el-form-item prop="to" label="对方账户">
          <el-input v-model="formData.to" @input="formData.to = formData.to.replace(' ', '')"></el-input>
        </el-form-item>
        <el-form-item
          v-if="sendTokenType !== TokenType.sys"
          prop="tokenId"
          :rules="tokenIdRules"
          label="Token名称"
        >
          <el-input
            :value="formData.tokenId"
            @input="formData.tokenId = $event.toUpperCase()"
            @blur="tokenIdBlur"
          ></el-input>
        </el-form-item>
        <el-form-item prop="amount" :rules="amountRules" label="Token数量">
          <el-input v-model="formData.amount" type="number"></el-input>
        </el-form-item>
        <el-form-item prop="fee" label="Gasfee">
          <el-input v-model="formData.fee" placeholder>
            <template slot="append">{{$_APP.CORE_SYMBOL}}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <TransactionResult v-if="result" :data="result" />
    </section>
    <el-button :loading="loading" type="primary" @click="confirm()" style="width:100%">开始转账</el-button>
    <ConfirmTx :visible.sync="showConfirmTx" :tx="txData" @confirm="confirmSendTx" />
  </div>
</template>

<script>
import TransactionResult from './TransactionResult'
import * as chainApi from '../../../common/chain-api'
import { TokenType } from '../../../common/enums.js'
import * as rules from './form-rules.js'
import ConfirmTx from './ConfirmTx'
import { genTransferTx } from './wallet-helper'
import { rmAddressPrefix } from '../../../common/utils'

export default {
  components: {
    TransactionResult,
    ConfirmTx
  },
  data() {
    return {
      sendTokenType: TokenType.sys,
      loading: false,
      result: null,
      formData: {
        to: '',
        tokenId: '',
        amount: '',
        fee: ''
      },
      showConfirmTx: false,
      txData: {}
    }
  },
  computed: {
    tokenIdRules() {
      let type
      if (this.sendTokenType === TokenType.normal) {
        type = rules.normalTokenShouldExist()
      }
      if (this.sendTokenType === TokenType.smart) {
        type = rules.bancorTokenShouldExist()
      }
      return [...this.formRules.tokenId, type]
    },
    amountRules() {
      let maxDecimalCount = rules.maxDecimalCount(9)
      if (this.sendTokenType === TokenType.smart) {
        maxDecimalCount = rules.maxDecimalCount(12)
      } else if (this.sendTokenType === TokenType.normal) {
        // 普通token需要获取token精度后再做校验
        maxDecimalCount = this.getNormalTokenAmountValidator()
      }
      return [...this.formRules.amount, maxDecimalCount]
    }
  },
  beforeMount() {
    this.TokenType = TokenType
    this.tokenTypes = [TokenType.sys, TokenType.normal, TokenType.smart]

    const required = rules.required()
    const gt0 = rules.greaterThan(0)
    const validAdress = rules.validAdress()
    const validTokenId = rules.validTokenId()

    this.formRules = {
      to: [required, validAdress],
      tokenId: [required, validTokenId],
      amount: [required, gt0, rules.amountTooBig()],
      fee: [required, rules.maxDecimalCount(9), rules.greaterOrEqualThan(0.1)]
    }
  },
  methods: {
    typeChange() {
      this.result = null
      this.cleanForm()
    },
    async confirm() {
      this.result = null
      await this.$refs.form.validate()
      const formData = { ...this.formData }
      formData.to = rmAddressPrefix(formData.to)
      this.txData = genTransferTx({
        ...formData,
        tokenType: this.sendTokenType
      })
      this.showConfirmTx = true
    },
    async confirmSendTx(tx) {
      try {
        this.loading = true
        const res = await chainApi.sendTransaction(tx, this.$_APP.privateKey)
        this.result = {
          message: res.confirmed
            ? '成功，交易内容如下：'
            : '交易发送成功，但是在短时间内还没获取到交易成功执行的信息，请自行确认交易是否被链执行。交易内容如下：',
          json: res.tx
        }
        if (res.confirmed) {
          this.cleanForm()
        }
      } catch (e) {
        this.result = {
          message: '出错' + e
        }
      } finally {
        this.loading = false
      }
    },
    tokenIdBlur() {
      if (this.sendTokenType === TokenType.normal) {
        this.$refs.form.validateField(['amount'])
      }
    },
    getNormalTokenAmountValidator() {
      const validator = async (rule, value, callback) => {
        let err
        const tokenId = this.formData.tokenId
        if (rules.tokenIdToErrMessage(tokenId)) {
          err = '请先填写正确的 Token 名称'
        } else {
          let tokenInfo
          const [, decimal] = value.toString().split('.') //3.141592654
          if (
            this._lastFetchTokenInfo &&
            this._lastFetchTokenInfo.name === tokenId
          ) {
            tokenInfo = this._lastFetchTokenInfo
          } else {
            tokenInfo = await chainApi.getTokenInfo(tokenId)
            this._lastFetchTokenInfo = tokenInfo
          }
          if (!tokenInfo.name || tokenInfo.type !== 'normal') {
            // token不存在或者不为普通token
            err = '请先填写正确的 Token 名称'
          } else if (decimal && decimal.length > tokenInfo.content.precision) {
            err = `精度最大为小数点后${tokenInfo.content.precision}位`
          }
        }
        callback(err ? new Error(err) : undefined)
      }
      const res = {
        validator,
        trigger: ['blur']
      }
      return res
    },
    cleanForm() {
      this.$refs.form.resetFields()
      this.formData = this.$options.data().formData
    }
  }
}
</script>
