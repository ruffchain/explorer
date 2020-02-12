<style lang="scss" scoped>
.home-page {
  .chain-info {
    .piece {
      margin: 20px 0;
      text-align: center;
      .name {
      }
      .value {
        margin-top: 10px;
        display: block;
        font-size: 30px;
        font-weight: bolder;
      }
    }
  }
  .latest-list {
    font-size: 16px;
    // font-weight: 200;
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
        padding-left: 10px;
        display: flex;
        align-items: center;
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
  <div class="home-page ">
    <section class="card chain-info">
      <el-row>
        <el-col :xs="24" :sm="6">
          <div class="piece">
            <span class="name">最新区块</span>
            <span class="value">{{ chainOverview.blockHeight }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="6">
          <div class="piece">
            <span class="name">不可逆区块</span>
            <span class="value">
              {{ chainOverview.irreversibleBlockHeight }}
            </span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="6">
          <div class="piece">
            <span class="name">总交易数量</span>
            <span class="value">{{ chainOverview.txCount }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="6">
          <div class="piece">
            <span class="name">总账户数量</span>
            <span class="value">{{ chainOverview.userCount }}</span>
          </div>
        </el-col>
      </el-row>
    </section>

    <el-row :gutter="15">
      <el-col :sm="12">
        <section class="card blocks latest-list">
          <span class="title">最新不可逆区块</span>
          <transition-group name="flip-list" tag="ul">
            <li v-for="block in blocks" :key="block.number" class="list-item">
              <div class="lf-box">
                <div>
                  区块#
                  <router-link :to="'/block/' + block.number">
                    {{ block.number }}
                  </router-link>
                </div>
                <div>包含 {{ block.txs }} 个交易</div>
              </div>
              <div class="time">{{ block.timeAgo }}</div>
            </li>
          </transition-group>
        </section>
      </el-col>
      <el-col :sm="12">
        <section class="card transactions latest-list">
          <span class="title">最新交易</span>
          <transition-group name="flip-list" tag="ul">
            <li v-for="tx in transactions" :key="tx.hash" class="list-item">
              <div class="lf-box">
                <div>
                  交易#
                  <router-link :to="'/tx/' + tx.hash">
                    {{ tx.hash | shortHash }}
                  </router-link>
                </div>
                <div>
                  发起方
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
import { timeAgo, delay } from '../../common/utils.js'
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
      transactions: []
    }
  },
  mounted() {
    this.$_APP.loading = true
    this.autoUpdate()
    this.autoUpdateTimeAgo()
  },
  methods: {
    async update() {
      try {
        const res = await Promise.all([
          chainApi.getChainOverview(),
          chainApi.getLatestBlocks(),
          chainApi.getLatestTxs()
        ])
        this.chainOverview = res[0]
        const blocks = res[1].data
        const transactions = res[2].data

        const mapFun = item => {
          item.timeAgo = timeAgo(new Date(item.timestamp * 1000))
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
        const fun = item => {
          item.timeAgo = timeAgo(new Date(item.timestamp * 1000))
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
