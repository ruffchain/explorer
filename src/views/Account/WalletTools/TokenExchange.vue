<style lang="scss" scoped>
.token-exchange {
  .info-tip {
    margin-bottom: 15px;
    margin-left: 90px;
    color: #888;
    .token-name {
      display: inline-block;
      background: rgb(64, 158, 255);
      border-radius: 3px;
      padding: 0 5px;
      font-size: 12px;
      color: #fff;
    }
  }
  .el-alert {
    margin-bottom: 10px;
  }
}
</style>

<template>
  <div class="token-exchange">
    <el-alert :closable="false" title="智能Token交易由Bancor算法自动执行，暂不支持账户之间直接交易。" type="info" show-icon></el-alert>
    <section>
      <div class="top-radio-selecter">
        <el-radio-group size="mini" v-model="tokenExchangeType" @change="typeChange">
          <el-radio-button v-for="item in TOKEN_EXCHANGE_TYPES" :key="item" :label="item" />
        </el-radio-group>
      </div>
      <el-form ref="form" :model="formData" :rules="formRules" label-width="90px">
        <el-form-item prop="tokenId" label="Token名称">
          <el-input :value="formData.tokenId" @input="formData.tokenId = $event.toUpperCase()"></el-input>
        </el-form-item>
        <template v-if="formData.tokenId && tokenPrice">
          <div class="info-tip">
            1
            <span class="token-name">{{ formData.tokenId }}</span>
            = {{ tokenPrice }}
            <span class="token-name">{{$_APP.CORE_SYMBOL}}</span>
          </div>
          <div v-if="tokenExchangeType === TOKEN_EXCHANGE_TYPE.BUY" class="info-tip">
            最多可供购买 {{ maxAvaliableBuyCount }}
            <span class="token-name">{{ formData.tokenId }}</span>
            =
            {{ maxAvaliableBuySys }}
            <span
              class="token-name"
            >{{$_APP.CORE_SYMBOL}}</span>
          </div>
        </template>

        <template v-if="tokenExchangeType === TOKEN_EXCHANGE_TYPE.SELL">
          <el-form-item prop="amount" label="Token数量">
            <el-input v-model="formData.amount" type="number"></el-input>
          </el-form-item>
          <div v-if="canGetSysCount" class="info-tip">
            可获取
            {{ canGetSysCount }}
            <span class="token-name">{{$_APP.CORE_SYMBOL}}</span>
          </div>
        </template>
        <template v-else>
          <el-form-item prop="cost" label="花费">
            <el-input v-model="formData.cost" type="number">
              <template slot="append">{{$_APP.CORE_SYMBOL}}</template>
            </el-input>
          </el-form-item>
          <div v-if="canGetTokenCount" class="info-tip">
            可获取
            {{ canGetTokenCount }}
            <span class="token-name">{{ formData.tokenId }}</span>
          </div>
        </template>

        <el-form-item prop="fee" label="Gasfee">
          <el-input v-model="formData.fee" placeholder>
            <template slot="append">{{$_APP.CORE_SYMBOL}}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <TransactionResult v-if="result" :data="result" />
    </section>
    <el-button :loading="loading" type="primary" @click="confirm()" style="width:100%">开始交易</el-button>
    <ConfirmTx :visible.sync="showConfirmTx" :tx="txData" @confirm="confirmSendTx" />
  </div>
</template>

<script>
const BigNumber = require('bignumber.js')
import TransactionResult from './TransactionResult'
import * as chainApi from '../../../common/chain-api'
import { TOKEN_EXCHANGE_TYPE } from '../../../common/enums.js'
import * as rules from './form-rules.js'
import ConfirmTx from './ConfirmTx'
import { genExchangeTokenTx } from './wallet-helper'

export default {
  components: {
    TransactionResult,
    ConfirmTx
  },
  data() {
    return {
      tokenExchangeType: TOKEN_EXCHANGE_TYPE.BUY,
      loading: false,
      result: null,
      formData: {
        tokenId: '',
        amount: '',
        cost: '',
        fee: ''
      },
      maxAvaliableBuyCount: null,
      maxAvaliableBuySys: null,
      tokenPrice: null,
      showConfirmTx: false,
      txData: {}
    }
  },
  computed: {
    canGetSysCount() {
      let res = null
      if (this.tokenExchangeType === TOKEN_EXCHANGE_TYPE.SELL) {
        if (
          this.formData.amount &&
          this.formData.amount > 0 &&
          this.tokenPrice
        ) {
          res = new BigNumber(this.formData.amount)
            .times(this.tokenPrice)
            .toFixed(9)
        }
      }
      return res
    },
    canGetTokenCount() {
      let res = null
      if (this.tokenExchangeType === TOKEN_EXCHANGE_TYPE.BUY) {
        if (this.formData.cost && this.formData.cost > 0 && this.tokenPrice) {
          res = new BigNumber(this.formData.cost)
            .dividedBy(this.tokenPrice)
            .toFixed(12)
        }
      }
      return res
    }
  },
  beforeMount() {
    this.TOKEN_EXCHANGE_TYPE = TOKEN_EXCHANGE_TYPE
    this.TOKEN_EXCHANGE_TYPES = [
      TOKEN_EXCHANGE_TYPE.BUY,
      TOKEN_EXCHANGE_TYPE.SELL
    ]

    const required = rules.required()
    const gt0 = rules.greaterThan(0)
    const validAdress = rules.validAdress()

    this.formRules = {
      to: [required, validAdress],
      tokenId: [
        {
          validator: async (rule, value, callback) => {
            callback()
            if (!this._submitValidate) {
              this.tokenPrice = null
              this.maxAvaliableBuyCount = null
              this.maxAvaliableBuySys = null
            }
          },
          trigger: ['change']
        },
        required,
        rules.validTokenId(),
        rules.bancorTokenShouldExist(),
        {
          validator: async (rule, value, callback) => {
            callback()
            if (!this._submitValidate) {
              const token = this.formData.tokenId
              const { F, S, R } = await chainApi.getBancorTokenParams(token)
              const {
                content: { supply, nonliquidity }
              } = await chainApi.getTokenInfo(token)

              // this.maxAvaliableBuyCount = supply + nonliquidity - S
              this.maxAvaliableBuyCount = new BigNumber(supply)
                .plus(nonliquidity)
                .minus(S)
                .toFixed(12)
              this.tokenPrice = chainApi.getSysByToken(F, S, R, 1)
              this.maxAvaliableBuySys = new BigNumber(this.tokenPrice)
                .times(this.maxAvaliableBuyCount)
                .toFixed(9)
            }
          },
          trigger: ['blur']
        }
      ],
      amount: [required, gt0, rules.maxDecimalCount(12), rules.amountTooBig()],
      cost: [
        required,
        gt0,
        rules.maxDecimalCount(9),
        rules.amountTooBig(),
        {
          validator: async (rule, value, callback) => {
            let err = undefined
            if (this.maxAvaliableBuySys) {
              console.log(value, this.maxAvaliableBuySys)
              if (new BigNumber(value).isGreaterThan(this.maxAvaliableBuySys)) {
                err = `最多可购买 ${this.maxAvaliableBuySys} ${this.$_APP.CORE_SYMBOL} 的智能Token`
              }
            }
            callback(err)
          },
          trigger: ['change']
        }
      ],
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
      this._submitValidate = true
      await this.$refs.form.validate()
      this.txData = genExchangeTokenTx({
        ...this.formData,
        tokenExchangeType: this.tokenExchangeType
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
        this._submitValidate = false
      }
    },
    cleanForm() {
      this.$refs.form.resetFields()
      this.formData = this.$options.data().formData
    }
  }
}
</script>
