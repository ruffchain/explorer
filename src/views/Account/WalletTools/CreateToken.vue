<style lang="scss" scoped>
.create-token {
  .title {
    margin-left: 20px;
    margin-bottom: 20px;
    // color: #000;
    font-weight: bolder;
  }
  .err-msg {
    color: #f00;
    margin-left: 10px;
    display: inline-block;
  }
  .receiver-list {
    .delete-btn {
      float: right;
      margin: 5px 0;
    }
    .footer {
      text-align: right;
      margin-bottom: 10px;
    }
  }
  .el-col {
    > .el-form-item {
      width: 100%;
    }
  }
  .input-group-append-max-height {
    height: 62px;
    overflow: hidden;
  }
  .el-alert {
    margin: 20px 0;
  }
}
</style>

<template>
  <div class="create-token">
    <section>
      <div class="top-radio-selecter">
        <el-radio-group
          size="mini"
          v-model="createTokenType"
          @change="typeChange"
        >
          <el-radio-button :label="TokenType.normal"></el-radio-button>
          <el-radio-button :label="TokenType.smart"></el-radio-button>
        </el-radio-group>
      </div>
      <el-alert
        v-if="createTokenType === TokenType.smart"
        :closable="false"
        title="智能Token是以SYS Token作为准备金发行的，支持Bancor协议流通兑换的Token"
        type="info"
        show-icon
      ></el-alert>
      <el-form
        ref="form"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item prop="tokenId" label="Token名称">
          <el-input
            :value="formData.tokenId"
            @input="formData.tokenId = $event.toUpperCase()"
          ></el-input>
        </el-form-item>

        <template v-if="createTokenType === TokenType.normal">
          <el-form-item
            prop="normalTotal"
            :rules="normalTotalRules"
            label="发行总量"
          >
            <el-input v-model="formData.normalTotal" type="number"></el-input>
          </el-form-item>
          <el-form-item prop="precision" label="Token精度">
            <el-input v-model="formData.precision" type="number"></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="24">
              <div class="title">发行总量 {{ tokenSmartTotal }}</div>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="initPublish" label="初始发行量">
                <el-input
                  v-model="formData.initPublish"
                  type="number"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="nonLiquidity" label="流通发行量">
                <el-input
                  v-model="formData.nonLiquidity"
                  type="number"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <div class="title">Token 初始定价</div>
            </el-col>

            <el-col :span="12" class="input-group-append-max-height">
              <el-form-item prop="cost" label="初始准备金">
                <el-input v-model="formData.cost" type="number">
                  <template slot="append">
                    SYS
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="factor" label="准备金率">
                <el-input
                  v-model="formData.factor"
                  placeholder="0到1之间"
                  type="number"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="初始发行量">
                <el-input v-model="formData.initPublish" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12" class="input-group-append-max-height">
              <el-form-item label="初始价格">
                <el-input :value="initPrise" disabled>
                  <template slot="append">
                    SYS
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <div v-if="createTokenType === TokenType.normal" class="title">
          发行量分配
          <span class="err-msg" v-if="normalDistErr">
            分配总量必须等于发行量
          </span>
        </div>

        <div v-else class="title">
          初始发行量分配
          <span class="err-msg" v-if="smartDistErr">
            分配数量+锁定数量需等于初始发行量
          </span>
        </div>

        <section class="receiver-list">
          <el-row v-for="(item, index) in formData.preBalances" :key="index">
            <el-col :span="14">
              <el-form-item
                :prop="'preBalances.' + index + '.address'"
                :rules="formRules.preBalancesAddress"
                label="账户"
              >
                <el-input
                  v-model="item.address"
                  @input="item.address = item.address.replace(' ', '')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :prop="'preBalances.' + index + '.amount'"
                :rules="preBalancesAmountRules"
                label="分配数量"
              >
                <el-input v-model="item.amount" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                class="delete-btn"
                @click="deletePreBalance(item)"
                :disabled="loading"
                v-if="index !== 0"
              ></el-button>
            </el-col>
            <template v-if="createTokenType === TokenType.smart">
              <el-col :span="6">
                <el-form-item label="锁定数量">
                  <el-switch v-model="item.lock"> </el-switch>
                </el-form-item>
              </el-col>
              <template v-if="item.lock">
                <el-col :span="8">
                  <el-form-item
                    :prop="'preBalances.' + index + '.time_expiration'"
                    :rules="formRules.time_expiration"
                    label="解锁日期"
                  >
                    <el-date-picker
                      v-model="item.time_expiration"
                      type="datetime"
                      placeholder="选择日期时间"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :prop="'preBalances.' + index + '.lock_amount'"
                    :rules="preBalancesAmountRules"
                    label="锁定数量"
                  >
                    <el-input v-model="item.lock_amount"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </template>
            <el-col
              :span="24"
              style="border-bottom:solid 1px #ddd;width:100%;margin-bottom:20px"
            ></el-col>
          </el-row>

          <div class="footer">
            <el-button
              icon="el-icon-circle-plus-outline"
              size="medium"
              type="primary"
              :disabled="loading"
              @click="addPreBalance()"
            >
              添加发行方
            </el-button>
          </div>
        </section>

        <el-form-item prop="fee" label="Gasfee">
          <el-input v-model="formData.fee" placeholder>
            <template slot="append">
              SYS
            </template>
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
    >
      创建 Token
    </el-button>

    <ConfirmTx
      :visible.sync="showConfirmTx"
      :tx="txData"
      @confirm="confirmSendTx"
    />
  </div>
</template>

<script>
const BigNumber = require('bignumber.js')
import TransactionResult from './TransactionResult'
import * as chainApi from '../../../common/chain-api'
import { TokenType } from '../../../common/enums.js'
import * as rules from './form-rules.js'
import ConfirmTx from './ConfirmTx'
import { genCreateTokenTx } from './wallet-helper'

export default {
  components: {
    TransactionResult,
    ConfirmTx
  },
  data() {
    return {
      createTokenType: TokenType.normal,
      result: null,
      loading: false,
      formData: {
        preBalances: [
          {
            address: '',
            amount: '100',
            lock: false,
            time_expiration: '',
            lock_amount: '0'
          }
        ],
        tokenId: '',
        nonLiquidity: '0',
        cost: '',
        factor: '',
        fee: '',
        normalTotal: 100,
        initPublish: 100,
        precision: 9 // token 精度
      },
      showConfirmTx: false,
      txData: {}
    }
  },
  computed: {
    normalTotalRules() {
      let maxDecimalCount = rules.maxDecimalCount(9)
      if (rules.validTokenPrecision(this.formData.precision)) {
        maxDecimalCount = rules.maxDecimalCount(this.formData.precision)
      }
      return [...this.formRules.normalTotal, maxDecimalCount]
    },
    preBalancesAmountRules() {
      let maxDecimalCount = rules.maxDecimalCount(12) //12 for smart token
      if (this.createTokenType === TokenType.normal) {
        maxDecimalCount = rules.maxDecimalCount(9)
        if (rules.validTokenPrecision(this.formData.precision)) {
          maxDecimalCount = rules.maxDecimalCount(this.formData.precision)
        }
      }
      return [...this.formRules.preBalancesAmount, maxDecimalCount]
    },
    preBalanceTotalAmount() {
      return this.formData.preBalances
        .reduce((prev, item) => {
          prev = prev.plus(item.amount)
          if (this.createTokenType === TokenType.smart && item.lock) {
            prev = prev.plus(item.lock_amount)
          }
          return prev
        }, new BigNumber(0))
        .toString()
    },
    tokenSmartTotal() {
      return new BigNumber(0)
        .plus(this.formData.initPublish)
        .plus(this.formData.nonLiquidity)
        .toString()
    },
    initPrise() {
      return new BigNumber(this.formData.cost)
        .div(this.formData.factor)
        .div(this.formData.initPublish)
        .toString()
    },
    normalDistErr() {
      return (
        this.preBalanceTotalAmount !==
        new BigNumber(this.formData.normalTotal).toString()
      )
    },
    smartDistErr() {
      return (
        this.preBalanceTotalAmount !==
        new BigNumber(this.formData.initPublish).toString()
      )
    }
  },
  watch: {
    'formData.precision': function() {
      // 在token精度改变时重新相关字段校验
      this.$nextTick(function() {
        let fields = this.formData.preBalances.map((item, i) => {
          return `preBalances.${i}.amount`
        })
        if (this.createTokenType === TokenType.smart) {
          const fields2 = this.formData.preBalances.map((item, i) => {
            return `preBalances.${i}.lock_amount`
          })
          fields = [...fields, ...fields2]
        }
        this.$refs.form.validateField(['normalTotal', ...fields])
      })
    }
  },
  beforeMount() {
    this.TokenType = TokenType
    const required = rules.required()
    const gt0 = rules.greaterThan(0)
    const ge0 = rules.greaterOrEqualThan(0)
    const le1 = rules.lessOrEqualThan(1)
    const validAdress = rules.validAdress()
    const amountTooBig = rules.amountTooBig()
    const maxDecimalCount9 = rules.maxDecimalCount(9)
    const maxDecimalCount12 = rules.maxDecimalCount(12)

    this.formRules = {
      tokenId: [required, rules.validTokenId(), rules.tokenShouldNotExist()],
      nonLiquidity: [required, ge0, maxDecimalCount12, amountTooBig],
      cost: [required, gt0, maxDecimalCount9, amountTooBig],
      factor: [required, gt0, le1],
      fee: [
        required,
        rules.maxDecimalCount(9),
        rules.greaterOrEqualThan(0.1)
      ],
      normalTotal: [required, gt0, amountTooBig],
      initPublish: [required, gt0, maxDecimalCount12, amountTooBig],
      preBalancesAddress: [required, validAdress],
      preBalancesAmount: [required, gt0],
      precision: [rules.tokenPrecision()],
      time_expiration: [
        required,
        {
          validator: async (rule, value, callback) => {
            let err
            if (new Date(value).getTime() < Date.now() + 30 * 60 * 1000) {
              err = `时间必须在30分钟之后`
            }
            err ? callback(new Error(err)) : callback()
          },
          trigger: ['change']
        }
      ]
    }
  },
  methods: {
    typeChange() {
      this.result = null
      this.cleanForm()
    },
    addPreBalance() {
      this.formData.preBalances.push({
        address: '',
        amount: '100',
        lock: false,
        time_expiration: '',
        lock_amount: '0'
      })
    },
    deletePreBalance(item) {
      this.formData.preBalances = this.formData.preBalances.filter(
        temp => item !== temp
      )
    },
    async confirm() {
      this.result = null
      await this.$refs.form.validate()

      if (this.createTokenType === TokenType.normal && this.normalDistErr) {
        return
      }
      if (this.createTokenType === TokenType.smart && this.smartDistErr) {
        return
      }
      this.txData = genCreateTokenTx({
        ...this.formData,
        tokenType: this.createTokenType
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
    cleanForm() {
      this.$refs.form.resetFields()
      this.formData = this.$options.data().formData
    }
  }
}
</script>
