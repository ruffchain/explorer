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
    <el-collapse :value="['1']">
      <el-collapse-item name="1">
        <div slot="title" class="section-title">
        {{ strTitle }}
        <i class="header-icon el-icon-sugar"></i>
        </div>
        <ul>
          <li>Deposit Address is: {{ $_APP.ADDRESS_PREFIX +$_APP.DEPOSIT_ADDRESS }}</li>
        </ul>
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

    }
  },
  mounted: function (){

  },
  beforeMount(){
    console.log("Earnings Mount")
    console.log(":" )
    console.log(globalData.loading)
    console.log(globalData.DEPOSIT_ADDRESS)
    console.log(process.env)
  },
  computed:{
    strTitle(){
      return this.$t('Earnings.title')
    },
    strDepositAddress(){
      return 'ruff' 
    }
  }
}
</script>
