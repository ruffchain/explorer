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
          投票规则
          <i class="header-icon el-icon-info"></i>
        </div>
        <ul>
          <li>1. 投票权通过冻结{{$_APP.CORE_SYMBOL}}获得，冻结1{{$_APP.CORE_SYMBOL}}可得1投票权。</li>
          <li>2. 每10分钟为一个有效投票周期。</li>
          <li>3. 周期内可多次投票（每隔60秒可投一次），但仅最后一次投票生效。</li>
          <li>4. 一次最多可投7个节点，每个节点都将获得全部票数。</li>
          <li>5. 再次冻结{{$_APP.CORE_SYMBOL}}后所得票数将自动追加给当前已投节点。</li>
          <li>6. {{$_APP.CORE_SYMBOL}}冻结3天后可申请解冻。解冻后，相应已投票数将被自动撤销。</li>
        </ul>
      </el-collapse-item>
      <el-collapse-item name="2">
        <div slot="title" class="section-title">冻结/解冻 {{$_APP.CORE_SYMBOL}}</div>
        <el-form ref="stackForm" :model="stackForm" :rules="stackFormRules" label-width="80px">
          <el-form-item label>
            <el-radio-group v-model="stackForm.operateType" size="mini">
              <el-radio-button label="冻结">冻结 {{$_APP.CORE_SYMBOL}}</el-radio-button>
              <el-radio-button label="解冻">解冻 {{$_APP.CORE_SYMBOL}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="amount" :label="`${stackForm.operateType}数量`">
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
            >确认{{ stackForm.operateType }}</el-button>
          </el-form-item>
        </el-form>
        <TransactionResult v-if="stackResult" :data="stackResult" />
        <LoadingContainer :loading="stackDetailLoading" class="freeze-list-contaienr">
          <div class="section-title">当前冻结状况</div>
          <ul class="freeze-list">
            <li class="freeze-row freeze-header">
              <div class="amount">冻结 {{$_APP.CORE_SYMBOL}} 数量</div>
              <div class="time">可解冻时间</div>
              <div class="status">状态</div>
            </li>
            <li v-for="(item, index) in stackList" :key="index" class="freeze-row">
              <div class="amount">{{ item.amount }}</div>
              <div class="time">{{ item.dueTime | toLoaclString }}</div>
              <div class="status">{{ item.dueTime > now ? '时间未到，不' : '' }}可解冻</div>
            </li>
          </ul>
        </LoadingContainer>
      </el-collapse-item>
      <el-collapse-item name="3" v-if="stackList && stackList.length">
        <div slot="title" class="section-title">投票</div>
        <el-form ref="voteForm" :model="voteForm" :rules="voteFormRules" label-width="80px">
          <el-form-item prop="candidates" label="选择节点">
            <el-select v-model="voteForm.candidates" multiple placeholder="请选择" style="width:100%">
              <el-option
                v-for="(item, index) in candidateList"
                :key="index"
                :label="item.name + ' - ' + item.location"
                :value="item.candidate"
              >
                <div style="display:flex;padding-right:10px;">
                  <span style="flex:1; ">{{ item.name }} - {{ item.location }}</span>
                  <span style="color: #8492a6; font-size: 13px">{{ item.candidate }}</span>
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
            <el-button :loading="voteLoading" @click="vote" type="primary">确认投票</el-button>
          </el-form-item>
        </el-form>
        <TransactionResult v-if="voteResult" :data="voteResult" />
        <LoadingContainer :loading="voteDetailLoading" v-if="voteDetail && voteDetail.amount">
          <div class="section-title">当前投票</div>
          <ParameterRow name="投票时间:">{{ voteDetail.timestamp | toLoaclString }}</ParameterRow>

          <ParameterRow name="投票数:">{{ voteDetail.amount | slice(1) }}</ParameterRow>
          <div class>
            <span class>所投节点</span>
            <span>
              <span v-for="(item, i) in voteDetail.candidates" :key="item.candidate">
                <span v-if="i != 0">,</span>
                <router-link
                  :to="`/address/${item.candidate}`"
                >{{ item.name + ' - ' + item.location + '-' + item.candidate }}</router-link>
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

export default {
  components: {
    TransactionResult,
    ConfirmTx,
    ParameterRow,
    LoadingContainer
  },
  data() {
    return {
      showConfirmTx: false,
      txData: '',
      stackLoading: false,
      stackDetailLoading: false,
      stackResult: null,
      stackForm: {
        operateType: '冻结',
        fee: '0.1',
        amount: 0
      },
      stackList: [],
      voteLoading: false,
      voteDetailLoading: false,
      voteResult: null,
      voteForm: {
        candidates: [],
        fee: '0.1'
      },
      candidateList: [],
      voteDetail: null,
      now: Date.now()
    }
  },
  beforeMount() {
    const required = rules.required()
    const fee = [
      required,
      rules.maxDecimalCount(9),
      rules.greaterOrEqualThan(0.1)
    ]
    this.stackFormRules = {
      amount: [
        required,
        {
          validator: async (rule, value, callback) => {
            let err
            if (value < 1) {
              err = `数字必须大于等于1`
            }
            if (Number.parseInt(value).toString() !== value.toString()) {
              err = `数字必须是整数`
            }
            err ? callback(new Error(err)) : callback()
          },
          trigger: ['change']
        }
      ],
      fee
    }
    this.voteFormRules = {
      candidates: [
        required,
        {
          validator: async (rule, value, callback) => {
            let err
            if (value.length > 7) {
              err = `最多只能选择7个节点`
            }
            err ? callback(new Error(err)) : callback()
          },
          trigger: ['change']
        }
      ],
      fee
    }
    this.updateStackList()
    this.updateCandidateList()
    this.updateVoteDetail()
  },
  methods: {
    async updateCandidateList() {
      this._candidateListPromise = chainApi.getCandidates().then(res => {
        this.candidateList = res.candidates.map(item => {
          Object.keys(item).forEach(key => {
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
        .then(res => {
          const voteDetail = res.value
          return this._candidateListPromise.then(() => {
            if (voteDetail && voteDetail.candidates) {
              voteDetail.candidates = voteDetail.candidates.map(address => {
                return this.candidateList.find(
                  item => item.candidate === address.slice(1)
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
        .then(res => {
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
          message: res.confirmed
            ? '成功，交易内容如下：'
            : '交易发送成功，但是在短时间内还没获取到交易成功执行的信息，请自行确认交易是否被链执行。交易内容如下：',
          json: res.tx
        }
      } catch (e) {
        result = {
          message: '出错' + e
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
      if (type === '冻结') {
        this.txData = walletHelper.genMortgageTx(amount, fee)
      } else if (type === '解冻') {
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
    }
  }
}
</script>
