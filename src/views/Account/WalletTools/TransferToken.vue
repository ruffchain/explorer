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
        <el-radio-group
          size="mini"
          v-model="sendTokenType"
          @change="typeChange"
        >
          <el-radio-button :label="getTokenSys"></el-radio-button>
          <el-radio-button :label="getTokenNormal"></el-radio-button>
          <el-radio-button :label="getTokenSmart"></el-radio-button>
        </el-radio-group>
      </div>
      <el-alert
        v-if="sendTokenType === getTokenSmart"
        :closable="false"
        :title="strTitle"
        type="info"
        show-icon
      ></el-alert>
      <el-form
        ref="form"
        :model="formData"
        :rules="formRules"
        label-width="90px"
      >
        <el-form-item prop="to" :label="strToAccount">
          <el-input
            v-model="formData.to"
            @input="formData.to = formData.to.replace(' ', '')"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="sendTokenType !== getTokenSys"
          prop="tokenId"
          :rules="tokenIdRules"
          :label="strTokenName"
        >
          <el-input
            :value="formData.tokenId"
            @input="formData.tokenId = $event.toUpperCase()"
            @blur="tokenIdBlur"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="amount"
          :rules="amountRules"
          :label="strTokenAmount"
        >
          <el-input v-model="formData.amount" type="number"></el-input>
        </el-form-item>
        <el-form-item prop="fee" label="Gasfee">
          <el-input v-model="formData.fee" placeholder>
            <template slot="append">{{ $_APP.CORE_SYMBOL }}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <TransactionResult v-if="result" :data="result" />
    </section>
    <el-button
      :loading="loading"
      type="primary"
      @click="confirm()"
      style="width:100%"
      >{{ strTokenConfirm }}</el-button
    >
    <ConfirmTx
      :visible.sync="showConfirmTx"
      :tx="txData"
      @confirm="confirmSendTx"
    />
    <AppDialog
      :title="sendTokenType + transfer"
      @cleanForm="cleanForm(), (loading = false)"
      v-if="loading"
    />
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
import AppDialog from '../../../components/AppDialog'

export default {
  components: {
    TransactionResult,
    ConfirmTx,
    AppDialog
  },
  data() {
    return {
      sendTokenType: process.env.VUE_APP_CORE_SYMBOL + ' Token',
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
  watch: {
    getTokenNormal: function() {
      this.sendTokenType = process.env.VUE_APP_CORE_SYMBOL + ' Token'
    }
  },
  computed: {
    tokenIdRules() {
      let type
      if (this.sendTokenType === this.getTokenNormal) {
        type = rules.normalTokenShouldExist()
      }
      if (this.sendTokenType === this.getTokenSmart) {
        type = rules.bancorTokenShouldExist()
      }
      return [...this.formRules.tokenId, type]
    },
    amountRules() {
      let maxDecimalCount = rules.maxDecimalCount(9)
      if (this.sendTokenType === this.getTokenSmart) {
        maxDecimalCount = rules.maxDecimalCount(12)
      } else if (this.sendTokenType === this.getTokenNormal) {
        // 普通token需要获取token精度后再做校验
        maxDecimalCount = this.getNormalTokenAmountValidator()
      }
      return [...this.formRules.amount, maxDecimalCount]
    },
    strTitle() {
      return (
        this.$t('CreateToken.title1') +
        `${$_APP.CORE_SYMBOL}` +
        this.$t('CreateToken.title2')
      )
    },
    strToAccount() {
      return this.$t('TransferToken.toAccount')
    },
    strTokenName() {
      return this.$t('CreateToken.tokenName')
    },
    strTokenConfirm() {
      return this.$t('TransferToken.confirm')
    },
    strTokenAmount() {
      return this.$t('TransferToken.tokenAmount')
    },
    // getTokenType() {
    //   return {
    //     sys: process.env.VUE_APP_CORE_SYMBOL + ' Token',
    //     normal: this.$t('TransferToken.normal') + ' Token',
    //     smart: this.$t('TransferToken.smart') + ' Token',
    //   }
    // },
    getTokenSys() {
      return process.env.VUE_APP_CORE_SYMBOL + ' Token'
    },
    getTokenNormal() {
      return this.$t('TransferToken.normal') + ' Token'
    },
    getTokenSmart() {
      return this.$t('TransferToken.smart') + ' Token'
    },
    transfer() {
      return this.$t('TransferToken.transfer')
    }
  },
  beforeMount() {
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
    transformTokenType(type) {
      if (type === this.getTokenSys) {
        return TokenType.sys
      } else if (type === this.getTokenNormal) {
        return TokenType.normal
      } else if (type === this.getTokenSmart) {
        return TokenType.smart
      } else {
        return null
      }
    },
    async confirm() {
      this.result = null
      await this.$refs.form.validate()
      const formData = { ...this.formData }
      formData.to = rmAddressPrefix(formData.to)
      this.txData = genTransferTx({
        ...formData,
        tokenType: this.transformTokenType(this.sendTokenType)
      })
      this.showConfirmTx = true
    },
    async confirmSendTx(tx) {
      try {
        this.loading = true
        const res = await chainApi.sendTransaction(tx, this.$_APP.privateKey)
        this.result = {
          message: res.confirmed
            ? this.$t('TransferToken.confirmedOk')
            : this.$t('TransferToken.confirmedFail'),
          json: res.tx
        }
        if (res.confirmed) {
          this.cleanForm()
        }
      } catch (e) {
        this.result = {
          message: this.$t('TransferToken.resultCatch') + e
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
          err = this.$t('TransferToken.validErr')
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
            err = this.$t('TransferToken.validErr')
          } else if (decimal && decimal.length > tokenInfo.content.precision) {
            err =
              this.$t('TransferToken.precisionErr') +
              `${tokenInfo.content.precision}` +
              this.$t('TransferToken.precisionBit')
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
