<style lang="scss" scoped>
.earnings-view {
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
  <div class="earnings-view">
    <el-collapse :value="['1', 'address', 'earning', 'deposit']">
      <el-collapse-item name="1">
        <div slot="title" class="section-title">
          {{ strTitle }}
          <em class="header-icon el-icon-sugar"></em>
        </div>
        <ul>
          <li>
            1. {{ description1 }}:
            {{ $_APP.ADDRESS_PREFIX + depositAddress }}
          </li>
          <li>2. {{ description2 }}</li>
        </ul>

        <h3 v-if="!validAccount">欢迎参加!</h3>
      </el-collapse-item>
      <el-collapse-item name="address" v-if="validAccount">
        <div slot="title" class="section-title">
          {{ strUsdtTitle }} :
          <el-link type="danger">{{ usdtAddress }}</el-link>
        </div>
        <LoadingContainer :loading="loading">
          <el-button type="info" size="small" plain>{{
            strUsdtEdit
          }}</el-button>
        </LoadingContainer>
      </el-collapse-item>
      <el-collapse-item name="earning" v-if="validAccount">
        <div slot="title" class="section-title">
          {{ strUsdtEarning }} : {{ earning }}
        </div>
        <LoadingContainer :loading="loading">
          <ul class="freeze-list">
            <li class="freeze-row freeze-header">
              <div class="amount">{{ strEarningAmount }}</div>
              <div class="time">{{ strEarningTime }}</div>
              <div class="status">{{ strEarningStatus }}</div>
            </li>
            <li
              v-for="(item, index) in earningStackList"
              :key="index"
              class="freeze-row"
            >
              <div class="amount">{{ item.amount }}</div>
              <div class="time">{{ item.date | toLoaclString }}</div>
              <div class="status">{{ item.status }}</div>
            </li>
          </ul>
        </LoadingContainer>
      </el-collapse-item>
      <el-collapse-item name="deposit" v-if="validAccount">
        <div slot="title" class="section-title">
          {{ strDeposit }} : {{ deposit }}
        </div>
        <LoadingContainer :loading="loading">
          <ul class="freeze-list">
            <li class="freeze-row freeze-header">
              <div class="amount">{{ strDepositAmount }}</div>
              <div class="time">{{ strEarningTime }}</div>
              <div class="status">{{ strEarningStatus }}</div>
            </li>
            <li
              v-for="(item, index) in depositStackList"
              :key="index"
              class="freeze-row"
            >
              <div class="amount">{{ item.amount }}</div>
              <div class="time">{{ item.date | toLoaclString }}</div>
              <div class="status">{{ item.status }}</div>
            </li>
          </ul>
        </LoadingContainer>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import * as chainApi from '../../../common/chain-api'
import * as chainLib from '../../../common/chain-lib'
import LoadingContainer from '@/components/LoadingContainer'

export default {
  components: {
    LoadingContainer
  },
  data() {
    return {
      depositAddress:'Address',
      usdtAddress: 'Empty',
      earning: 0,
      deposit: 0,
      earningStackList: [],
      depositStackList: [],
      loading: true,
      validAccount: false
    }
  },
  mounted: function() {
    console.log('Earnings mounted')
  },
  beforeMount() {
    console.log('Earnings beforeMount')
    console.log(this.$_APP.privateKey)
    let privateKey = this.$_APP.privateKey
    let address = chainLib.addressFromSecretKey(privateKey)
    console.log(address)

    this.updateConfig()
    this.updateAccount(address)
  },
  computed: {
    strTitle() {
      return this.$t('Earnings.title')
    },
    description1() {
      return this.$t('Earnings.description1')
    },
    description2() {
      return this.$t('Earnings.description2')
    },
    strUsdtTitle() {
      return this.$t('Earnings.usdtTitle')
    },
    strUsdtEdit() {
      return this.$t('Earnings.usdtEdit')
    },
    strUsdtEarning() {
      return this.$t('Earnings.usdtEarning')
    },
    strDeposit() {
      return this.$t('Earnings.deposit')
    },
    strEarningAmount() {
      return this.$t('Earnings.earningAmount')
    },
    strEarningTime() {
      return this.$t('Earnings.earningTime')
    },
    strEarningStatus() {
      return this.$t('Earnings.earningStatus')
    },
    strDepositAmount() {
      return this.$t('Earnings.depositAmount')
    }
  },
  methods: {
    async updateConfig() {
      chainApi
        .getEarningsConfig()
        .then((res)=>{
          console.log("config",res)
          if(res.data.address){
            this.depositAddress =  res.data.address
          }
        })
        .finally(()=>{
          console.log("config ended")
        })
    },
    async updateAccount(address) {
      this.loading = true
      chainApi
        .getEarningsAccount(address)
        .then(res => {
          console.log(res)
          if (res.err === 0) {
            if (res.data.account) {
              this.validAccount = true
            }
            if(res.data.account.usdt){
              this.usdtAddress = res.data.account.usdt
            }
            this.earningStackList = []
            for(let earning of res.data.earnings){
              this.earningStackList.push({
                amount: earning.value,
                date: earning.date,
                status: earning.status
              })
            }
            this.depositStackList = []
            let depositSum = 0
            for(let deposit of res.data.deposit){
              this.depositStackList.push({
                amount: deposit.value,
                date: deposit.date,
                status: deposit.status
              })
              depositSum += parseFloat(deposit.value)
            }
            this.deposit = depositSum
          }
        })
        .finally(() => {
          console.log('load ending')
          this.loading = false
        })
    }
  }
}
</script>
