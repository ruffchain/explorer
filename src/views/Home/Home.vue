<style lang="scss" scoped>
.home-page {
  .chain-info {
    padding-top: 0px;
    padding-bottom: 0px;
    .piece {
      margin: 16px 0;
      text-align: center;
      .name {
        color: #5D7184;
      }
      .value {
        margin-top: 5px;
        display: block;
        font-size: 18px;
        font-weight: normal;
        color: #00C8CA;
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
      height: 600px;
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
      .lf-box {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
      }
      .time {
        font-size: 12px;
        padding-left: 10px;
        display: flex;
        align-items: center;
      }
      a{
        color: #3498DB;
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
            <span class="name">{{ strIrb}}</span>
            <span class="value">{{ chainOverview.irreversibleBlockHeight }}</span>
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
            <span class="name">{{ strAccountAmount}}</span>
            <span class="value">{{ chainOverview.userCount }}</span>
          </div>
        </el-col>
      </el-row>
    </section>

    <el-row :gutter="15">
      <el-col :sm="12">
        <section class="card blocks latest-list">
          <span class="title">{{ strIrbNew}}</span>
          <transition-group name="flip-list" tag="ul">
            <li v-for="block in blocks" :key="block.number" class="list-item">
              <div class="lf-box">
                <div>
                  {{ strBlockNum }}
                  <router-link :to="'/block/' + block.number">{{ block.number }}</router-link>
                </div>
                <div>{{ strContain}} {{ block.txs }} {{ strTransaction}}</div>
              </div>
              <div class="time">{{ block.timeAgo }}</div>
            </li>
          </transition-group>
        </section>
      </el-col>
      <el-col :sm="12">
        <section class="card transactions latest-list">
          <span class="title">{{ strTransactionNew}}</span>
          <transition-group name="flip-list" tag="ul">
            <li v-for="tx in transactions" :key="tx.hash" class="list-item">
              <div class="lf-box">
                <div>
                  {{ strTransactionNum}}
                  <router-link :to="'/tx/' + tx.hash">{{ tx.hash | shortHash }}</router-link>
                </div>
                <div>
                  {{ strSender }}
                  <router-link
                    :to="'/address/' + tx.address"
                  >{{$_APP.ADDRESS_PREFIX }}{{ tx.address | shortHash }}</router-link>
                </div>
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
    BPList,
  },
  data() {
    return {
      chainOverview: {
        blockHeight: '-',
        irreversibleBlockHeight: '-',
        txCount: '-',
      },
      blocks: [],
      transactions: [],
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
  },
  methods: {
    async update() {
      try {
        const res = await Promise.all([
          chainApi.getChainOverview(),
          chainApi.getLatestBlocks(),
          chainApi.getLatestTxs(),
        ])
        this.chainOverview = res[0]
        const blocks = res[1].data
        const transactions = res[2].data

        const mapFun = (item) => {
          item.timeAgo = newTimeAgo(new Date(item.timestamp * 1000))
          return item
        }

        this.blocks = blocks.map(mapFun)
        this.transactions = transactions.map(mapFun)
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
        const fun = (item) => {
          item.timeAgo = newTimeAgo(new Date(item.timestamp * 1000))
        }
        this.blocks.forEach(fun)
        this.transactions.forEach(fun)
        await delay(300)
      }
    },
  },
  beforeDestroy() {
    this.isBeingDestroyed = true
  },
}
</script>
