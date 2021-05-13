<style lang="scss" scoped>
.home-page {
  .chain-info {
    padding-top: 0px;
    padding-bottom: 0px;
    .piece {
      margin: 16px 0;
      text-align: center;
      .name {
        color: #5d7184;
      }
      .value {
        margin-top: 5px;
        display: block;
        font-size: 18px;
        font-weight: normal;
        color: #00c8ca;
      }
    }
  }
  .latest-list {
    font-size: 13px;

    // font-weight: 200;
    .title {
      font-size: 14px;
    }
    margin-top: 0;
    ul {
      height: 520px;
      overflow: hidden;
    }
    ul > li {
      display: flex;
      border-top: solid 1px #eee;
      padding: 5px;
      line-height: 2;
      &:last-child {
        border-bottom: solid 1px #eee;
      }
      .bk{
        display: flex;
        align-items: center;
        padding-left:8px;
        padding-right: 8px;
        margin-top:8px;
        margin-bottom: 8px;
        font-size: 16px;
        margin-right: 20px;
        //border:0 solid #9B9B9B;
        border-width: 2px;
        border-radius: 5px;
        background-color: #77838F1A;
      }
      .tx{
        border-radius: 20px;
      }
      .miner{
        display: flex;
        flex: 1;
        align-items: center;
       
      }
      .lf-box {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
      }
      .token{
        font-size: 10px;
        display: flex;
        align-items: center;
        margin:10px 5px 10px  5px;
        padding-left:5px;
        padding-right: 5px;
        background: rgba(68, 197, 142, 0.1);
        border-radius: 5px;
      }
      .value{
        font-size: 12px;
        display: flex;
        align-items: center;
        margin:0 5px 0 5px;
      }
      .time {
        font-size: 12px;
        margin:10px 0px 10px 0px;
        padding: 0px 10px 0px 20px;
        display: flex;
        align-items: center;
        background: #77838F1A;
        border-width: 2px;
        border-radius: 5px;
      }
      a {
        color: #3498db;
      }
    }
  }
  .flip-list-move {
    transition: transform 0.6s;
  }
  .flip-list-enter-active,
  .flip-list-leave-active {
    transition: all 1s;
  }
  .flip-list-enter,
  .flip-list-leave-to {
    opacity: 0;
    transform: translateX(60px);
  }
}
</style>

<template>
  <div class="home-page">
    <section class="card chain-info">
      <el-row>
        <el-col :xs="24" :sm="6">
          <div class="piece">
            <span class="name">{{ strBlock }}</span>
            <span class="value">{{ chainOverview.blockHeight }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="6">
          <div class="piece">
            <span class="name">{{ strIrb }}</span>
            <span class="value">{{
              chainOverview.irreversibleBlockHeight
            }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="6">
          <div class="piece">
            <span class="name">{{ strTxAmount }}</span>
            <span class="value">{{ chainOverview.txCount }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="6">
          <div class="piece">
            <span class="name">{{ strAccountAmount }}</span>
            <span class="value">{{ chainOverview.userCount }}</span>
          </div>
        </el-col>
      </el-row>
    </section>

    <el-row :gutter="15">
      <el-col :sm="12">
        <section class="card blocks latest-list">
          <span class="title">{{ strIrbNew }}</span>
          <transition-group name="flip-list" tag="ul">
            <li v-for="block in blocks" :key="block.number" class="list-item">
              <div class="bk">
                Bk
              </div>
              <div class="lf-box">
                <div>
                  {{ strBlockNum }}
                  <router-link :to="'/block/' + block.number">{{
                    block.number
                  }}</router-link>
                </div>
                <div>{{ strContain }} {{ block.txs }} {{ strTransaction }}</div>
              </div>
              <div class="miner" v-if="bpList !== []">
                 {{ strMinerName }} &nbsp; <a> {{ block.minerName}}</a>
              </div>
              <div class="time">{{ block.timeAgo }}</div>
            </li>
          </transition-group>
        </section>
      </el-col>
      <el-col :sm="12">
        <section class="card transactions latest-list">
          <span class="title">{{ strTransactionNew }}</span>
          <transition-group name="flip-list" tag="ul">
            <li v-for="tx in transactions" :key="tx.hash" class="list-item">
              <div class="bk tx">
                Tx
              </div>
              <div class="lf-box">
                <div>
                  {{ strTransactionNum }}
                  <router-link :to="'/tx/' + tx.hash">{{
                    tx.hash | shortHash
                  }}</router-link>
                </div>
                <div>
                  {{ strSender }}
                  <router-link :to="'/address/' + tx.address"
                    >{{ $_APP.ADDRESS_PREFIX
                    }}{{ tx.address | shortHash }}</router-link
                  >
                </div>
              </div>
              <div class="value">
                {{ tx.tokenValue}}&nbsp;
              </div>
              <div class="token">
                {{ tx.token }}
              </div>
              <div class="time">{{ tx.timeAgo }}</div>
            </li>
          </transition-group>
        </section>
      </el-col>
    </el-row>
    <BPList style="margin-top:-15px;" />
  </div>
</template>

<script>
import BPList from './BPList'
import { timeAgo, delay, newTimeAgo } from '../../common/utils.js'
import * as chainApi from '../../common/chain-api.js'

export default {
  components: {
    BPList
  },
  data() {
    return {
      chainOverview: {
        blockHeight: '-',
        irreversibleBlockHeight: '-',
        txCount: '-'
      },
      blocks: [],
      transactions: [],
      bpList:[],
    }
  },
  mounted() {
    this.$_APP.loading = true

    this.autoUpdate()
    this.autoUpdateTimeAgo()

  },
  computed: {
    strBlock() {
      return this.$t('Home.block')
    },
    strIrb() {
      return this.$t('Home.irb')
    },
    strTxAmount() {
      return this.$t('Home.txAmount')
    },
    strAccountAmount() {
      return this.$t('Home.accountAmount')
    },
    strIrbNew() {
      return this.$t('Home.irbNew')
    },
    strBlockNum() {
      return this.$t('Home.blockNum')
    },
    strContain() {
      return this.$t('Home.contain')
    },
    strTransaction() {
      return this.$t('Home.transaction')
    },
    strTransactionNew() {
      return this.$t('Home.transactionNew')
    },
    strTransactionNum() {
      return this.$t('Home.transactionNum')
    },
    strSender() {
      return this.$t('Home.sender')
    },
    strMinerName(){
      return this.$t("Block.blockNode ") 
    }
  },
  methods: {
    shortAmount(amount){
      let num = parseFloat(amount).toFixed(1)
      if( Math.floor(num) === Math.ceil(num)){
        return Math.ceil(num) + '';
      }else{
        return num + '';
      }
    },
    getAliasName( addr){
      if(this.bpList.length > 0){
        for(let bp of this.bpList){
          if(addr === bp.candidate){
            return bp.name
          }
        }
      }
    },
    async update() {
      try {
        const res = await Promise.all([
          chainApi.getCandidates(),
          chainApi.getChainOverview(),
          chainApi.getLatestBlocks(),
          chainApi.getLatestTxs()
        ])
      this.bpList = res[0].candidates
      this.bpList = this.bpList.map((item)=>{
        item.candidate = item.candidate.slice(1)
        item.name = item.name.slice(1)
        return item
      })

        this.chainOverview = res[1]
        const blocks = res[2].data

        const transactions = res[3].data

        const mapFun = item => {
          item.timeAgo = newTimeAgo(new Date(item.timestamp * 1000))

          item.minerName =  this.getAliasName(item.address)

          return item
        }

        this.blocks = blocks.map(mapFun)
        // console.log('blocks:')
        // console.log(this.blocks)
        const mapFunTx = item => {
          item.timeAgo = newTimeAgo(new Date(item.timestamp * 1000))

          item.token =  'RUFF'
          
          if(item.content.method === 'transferTo'){
             item.tokenValue = this.shortAmount(item.content.value)
          }
          else if(item.content.method === 'transferTokenTo' || item.content.method === 'transferSmartTokenTo'){
            item.token = item.content.input.tokenid
            item.tokenValue = this.shortAmount(item.content.input.amount)
          }else{
            item.tokenValue = item.content.fee
          }

          return item
        }

        this.transactions = transactions.map(mapFunTx)


        // console.log('tx')
        // console.log(this.transactions)
      } catch (e) {
      } finally {
        this.$_APP.loading = false
      }
    },
    async autoUpdate() {
      while (!this.isBeingDestroyed) {
        await this.update()
        await delay(5000)
      }
    },
    async autoUpdateTimeAgo() {
      while (!this.isBeingDestroyed) {
        const fun = item => {
          item.timeAgo = newTimeAgo(new Date(item.timestamp * 1000))
        }
        this.blocks.forEach(fun)
        this.transactions.forEach(fun)
        await delay(300)
      }
    }
  },
  beforeDestroy() {
    this.isBeingDestroyed = true
  }
}
</script>
