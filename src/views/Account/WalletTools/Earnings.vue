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
    <el-collapse :value="['1', 'address']">
      <el-collapse-item name="1">
        <div slot="title" class="section-title">
        {{ strTitle }}
        <i class="header-icon el-icon-sugar"></i>
        </div>
        <ul>
          <li>1. {{ description1 }}: {{ $_APP.ADDRESS_PREFIX + $_APP.DEPOSIT_ADDRESS }}</li>
          <li>2. {{ description2 }} </li>
        </ul>
      </el-collapse-item>
      <el-collapse-item name="address">
        <div slot="title" class="section-title">{{ strUsdtTitle }} </div>
        <el-link type="danger">{{ usdtAddress }}</el-link>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import globalData from '@/common/global-data'
export default {
  components: {

  },
  data(){
    return {
      usdtAddress: "Empty"
    }
  },
  mounted: function (){

  },
  beforeMount(){
    console.log("Earnings Mount")
  },
  computed:{
    strTitle(){
      return this.$t('Earnings.title')
    },
    description1(){
      return this.$t('Earnings.description1')
    },
    description2(){
      return this.$t('Earnings.description2')
    },
    strUsdtTitle(){
      return this.$t('Earnings.usdtTitle')
    },
    // strUsdtAddress(){
    //   return this.$t('Earnings.usdtAddress')
    // }
  }
}
</script>
