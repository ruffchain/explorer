<style lang="scss" scoped>
.vote-view {
  .section-title {
    font-weight: bolder;
    color: #559ef8;
  }
  .freeze-list {
    margin: 5px 0;
    .freeze-row {
      display: flex;
      border: solid 1px #eee;
      border-top: none;
      padding: 10px 20px;
    }
    .freeze-header {
      font-weight: bolder;
      border-top: solid 1px #eee;
      background: #efefef;
    }
    .time {
      flex: 1;
    }
    .amount {
      flex: 1;
    }
    .status {
      flex: 1;
    }
  }
}
</style>

<template>
  <div class="vote-view">
    <el-collapse :value="['2', '3']">
      <el-collapse-item name="1">
        <div slot="title" class="section-title">
          {{ strTitle}}
          <i class="header-icon el-icon-info"></i>
        </div>
        <ul>
          <li>1. {{ strRule1 }}</li>
          <li>2. {{ strRule2 }}</li>
          <li>3. {{ strRule3 }}</li>
          <li>4. {{ strRule4 }}</li>
          <li>5. {{ strRule5 }}</li>
          <li>6. {{ strRule6 }}</li>
        </ul>
      </el-collapse-item>
      <el-collapse-item name="2">
        <div slot="title" class="section-title">{{ strSectionTitle}} {{$_APP.CORE_SYMBOL}}</div>
        <el-form ref="stackForm" :model="stackForm" :rules="stackFormRules" label-width="150px">
          <el-form-item label>
            <el-radio-group v-model="stackForm.operateType" size="mini">
              <el-radio-button :label="strFreeze">{{strFreeze}} {{$_APP.CORE_SYMBOL}}</el-radio-button>
              <el-radio-button :label="strUnfreeze">{{strUnfreeze}} {{$_APP.CORE_SYMBOL}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="amount" :label="strAmount">
            <el-input type="number" v-model="stackForm.amount"></el-input>
          </el-form-item>
          <el-form-item prop="fee" label="Gasfee">
            <el-input type="number" v-model="stackForm.fee">
              <template slot="append">{{$_APP.CORE_SYMBOL}}</template>
            </el-input>
          </el-form-item>
          <el-form-item size="small">
            <el-button
              :loading="stackLoading"
              type="primary"
              @click="operateStack"
            >{{ strConfirm }} {{ stackForm.operateType }}</el-button>
          </el-form-item>
        </el-form>
        <AppDialog
          :title="stackForm.operateType"
          @cleanForm="stackLoading=false"
          v-if="stackLoading"
        />

        <TransactionResult v-if="stackResult" :data="stackResult" />
        <LoadingContainer :loading="stackDetailLoading" class="freeze-list-contaienr">
          <div class="section-title">{{ strFreezeStatus }}</div>
          <ul class="freeze-list">
            <li class="freeze-row freeze-header">
              <div class="amount">{{ strFreeze}} {{$_APP.CORE_SYMBOL}} {{ strAmountByWords }}</div>
              <div class="time">{{ strFreezeTime }}</div>
              <div class="status">{{ strStatus }}</div>
            </li>
            <li v-for="(item, index) in stackList" :key="index" class="freeze-row">
              <div class="amount">{{ item.amount }}</div>
              <div class="time">{{ item.dueTime | toLoaclString }}</div>
              <div class="status">{{ item.dueTime > now ? strDueTimeYes : strDueTime }}</div>
            </li>
          </ul>
        </LoadingContainer>
      </el-collapse-item>
      <el-collapse-item name="3" v-if="stackList && stackList.length">
        <div slot="title" class="section-title">{{ strVote }}</div>
        <el-form ref="voteForm" :model="voteForm" :rules="voteFormRules" label-width="80px">
          <el-form-item prop="candidates" :label="strChooseCandidate">
            <el-select
              v-model="voteForm.candidates"
              multiple
              :placeholder="strChoosePlaceHolder"
              style="width:100%"
            >
              <el-option
                v-for="(item, index) in candidateList"
                :key="index"
                :label="item.name + ' - ' + item.location"
                :value="item.candidate"
              >
                <div style="display:flex;padding-right:10px;">
                  <span style="flex:1; ">{{ item.name }} - {{ item.location }}</span>
                  <span
                    style="color: #8492a6; font-size: 13px"
                  >{{$_APP.ADDRESS_PREFIX}}{{ item.candidate }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="fee" label="Gasfee">
            <el-input type="number" v-model="voteForm.fee">
              <template slot="append">{{$_APP.CORE_SYMBOL}}</template>
            </el-input>
          </el-form-item>
          <el-form-item size="small">
            <el-button :loading="voteLoading" @click="vote" type="primary">{{ strConfirmVote}}</el-button>
          </el-form-item>
        </el-form>
        <AppDialog :title="strVote" @cleanForm="voteLoading=false" v-if="voteLoading" />

        <TransactionResult v-if="voteResult" :data="voteResult" />
        <LoadingContainer :loading="voteDetailLoading" v-if="voteDetail && voteDetail.amount">
          <div class="section-title">{{strCurrentVote}}</div>
          <ParameterRow :name="strVoteTime">{{ voteDetail.timestamp | toLoaclString }}</ParameterRow>

          <ParameterRow :name="strVoteNum">{{ voteDetail.amount | slice(1) }}</ParameterRow>
          <div class>
            <span class>{{ strVoteNodes }}</span>
            <span>
              <span v-for="(item, i) in voteDetail.candidates" :key="item.candidate">
                <span v-if="i != 0">,</span>
                <router-link
                  :to="`/address/${item.candidate}`"
                >{{ item.name + ' - ' + item.location + '-' + $_APP.ADDRESS_PREFIX + item.candidate }}</router-link>
              </span>
            </span>
          </div>
        </LoadingContainer>
      </el-collapse-item>
    </el-collapse>
    <ConfirmTx :visible.sync="showConfirmTx" :tx="txData" @confirm="confirmSendTx" />
  </div>
</template>

<script>
import * as walletHelper from './wallet-helper'
import * as rules from './form-rules.js'
import TransactionResult from './TransactionResult'
import ConfirmTx from './ConfirmTx'
import * as chainApi from '../../../common/chain-api'
import ParameterRow from '@/components/ParameterRow'
import LoadingContainer from '@/components/LoadingContainer'
import AppDialog from '../../../components/AppDialog'

export default {
  components: {
    TransactionResult,
    ConfirmTx,
    ParameterRow,
    LoadingContainer,
    AppDialog,
  },
  data() {
    return {
      showConfirmTx: false,
      txData: '',
      stackLoading: false,
      stackDetailLoading: false,
      stackResult: null,
      stackForm: {
        operateType: '',
        fee: '0.1',
        amount: 0,
      },
      stackList: [],
      voteLoading: false,
      voteDetailLoading: false,
      voteResult: null,
      voteForm: {
        candidates: [],
        fee: '0.1',
      },
      candidateList: [],
      voteDetail: null,
      now: Date.now(),
    }
  },
  mounted: function () {
    this.stackForm.operateType = this.strFreeze
  },
  beforeMount() {
    const required = rules.required()
    const fee = [
      required,
      rules.maxDecimalCount(9),
      rules.greaterOrEqualThan(0.1),
    ]
    this.stackFormRules = {
      amount: [
        required,
        {
          validator: async (rule, value, callback) => {
            let err
            if (value < 1) {
              err = this.strErr1
            }
            if (Number.parseInt(value).toString() !== value.toString()) {
              err = this.strErr2
            }
            err ? callback(new Error(err)) : callback()
          },
          trigger: ['change'],
        },
      ],
      fee,
    }
    this.voteFormRules = {
      candidates: [
        required,
        {
          validator: async (rule, value, callback) => {
            let err
            if (value.length > 7) {
              err = this.strErr3
            }
            err ? callback(new Error(err)) : callback()
          },
          trigger: ['change'],
        },
      ],
      fee,
    }
    this.updateStackList()
    this.updateCandidateList()
    this.updateVoteDetail()
  },
  computed: {
    strTitle() {
      return this.$t('Vote.title')
    },
    strRule1() {
      return (
        this.$t('Vote.rule1') +
        this.$_APP.CORE_SYMBOL +
        this.$t('Vote.rule11') +
        this.$_APP.CORE_SYMBOL +
        this.$t('Vote.rule12')
      )
    },
    strRule2() {
      return this.$t('Vote.rule2')
    },
    strRule3() {
      return this.$t('Vote.rule3')
    },
    strRule4() {
      return this.$t('Vote.rule4')
    },
    strRule5() {
      return this.$t('Vote.rule5') + this.$_APP.CORE_SYMBOL + this.$t('Vote.rule51')
    },
    strRule6() {
      return this.$_APP.CORE_SYMBOL + this.$t('Vote.rule6')
    },
    strSectionTitle() {
      return this.$t('Vote.sectionTitle')
    },
    strFreeze() {
      return this.$t('Vote.freeze')
    },
    strUnfreeze() {
      return this.$t('Vote.unfreeze')
    },
    strAmount() {
      return this.stackForm.operateType + ' ' + this.$t('Vote.amount')
    },
    strConfirm() {
      return this.$t('Vote.confirm')
    },
    strFreezeStatus() {
      return this.$t('Vote.freezeStatus')
    },
    strAmountByWords() {
      return this.$t('Vote.amount')
    },
    strFreezeTime() {
      return this.$t('Vote.freezeTime')
    },
    strStatus() {
      return this.$t('Vote.status')
    },
    strDueTime() {
      return this.$t('Vote.dueTime')
    },
    strDueTimeYes() {
      return this.$t('Vote.dueTimeYes')
    },
    strVote() {
      return this.$t('Vote.vote')
    },
    strChooseCandidate() {
      return this.$t('Vote.chooseCandidate')
    },
    strChoosePlaceHolder() {
      return this.$t('Vote.choosePlaceHolder')
    },
    strConfirmVote() {
      return this.$t('Vote.confirmVote')
    },
    strCurrentVote() {
      return this.$t('Vote.currentVote')
    },
    strVoteTime() {
      return this.$t('Vote.voteTime')
    },
    strVoteNum() {
      return this.$t('Vote.voteNum')
    },
    strVoteNodes() {
      return this.$t('Vote.voteNodes')
    },
    strErr1() {
      return this.$t('Vote.err1')
    },
    strErr2() {
      return this.$t('Vote.err2')
    },
    strErr3() {
      return this.$t('Vote.err3')
    },
    strSendOK() {
      return this.$t('Vote.sendOK')
    },
    strSendFail() {
      return this.$t('Vote.sendFail')
    },
    strFailCatch() {
      return this.$t('Vote.failCatch')
    },
  },
  watch: {
    strTitle: function () {
      this.stackForm.operateType = this.strFreeze
    },
  },
  methods: {
    async updateCandidateList() {
      this._candidateListPromise = chainApi.getCandidates().then((res) => {
        this.candidateList = res.candidates.map((item) => {
          Object.keys(item).forEach((key) => {
            item[key] = item[key].slice(1)
          })
          return item
        })
      })
    },
    async updateVoteDetail() {
      this.voteDetailLoading = true
      chainApi
        .getTicket(this.$_APP.address)
        .then((res) => {
          const voteDetail = res.value
          return this._candidateListPromise.then(() => {
            if (voteDetail && voteDetail.candidates) {
              voteDetail.candidates = voteDetail.candidates.map((address) => {
                return this.candidateList.find(
                  (item) => item.candidate === address.slice(1)
                )
              })
              this.voteDetail = voteDetail
            }
          })
        })
        .finally(() => {
          this.voteDetailLoading = false
        })
    },
    async updateStackList() {
      this.stackDetailLoading = true
      chainApi
        .getStacks(this.$_APP.address)
        .then((res) => {
          this.stackList = res.value.vote
        })
        .finally(() => {
          this.stackDetailLoading = false
        })
    },
    async confirmSendTx(tx) {
      if (tx.method === 'vote') {
        this.voteLoading = true
      } else {
        this.stackLoading = true
      }
      let result = null
      try {
        const res = await chainApi.sendTransaction(tx, this.$_APP.privateKey)
        result = {
          message: res.confirmed ? this.strSendOK : this.strSendFail,
          json: res.tx,
        }
      } catch (e) {
        result = {
          message: this.failCatch + e,
        }
      } finally {
        if (tx.method === 'vote') {
          this.voteLoading = false
          this.voteResult = result
          this.updateVoteDetail()
        } else {
          this.stackLoading = false
          this.stackResult = result
          this.updateStackList()
          this.updateVoteDetail()
        }
      }
    },
    async operateStack() {
      this.stackResult = null
      await this.$refs.stackForm.validate()
      const { amount, fee } = this.stackForm
      const type = this.stackForm.operateType
      if (type === this.strFreeze) {
        this.txData = walletHelper.genMortgageTx(amount, fee)
      } else if (type === this.strUnfreeze) {
        this.txData = walletHelper.genUnMortgageTx(amount, fee)
      }
      this.showConfirmTx = true
    },
    async vote() {
      this.voteResult = null
      await this.$refs.voteForm.validate()
      const { candidates, fee } = this.voteForm
      this.txData = walletHelper.genVoteTx(candidates, fee)
      this.showConfirmTx = true
    },
  },
}
</script>
