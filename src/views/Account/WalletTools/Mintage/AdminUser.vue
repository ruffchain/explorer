<style lang="scss" scoped>
.admin-user {
  .el-alert {
    margin: 20px 0;
  }
}
</style>

<template>
  <div class="admin-user">
    <section>
      <h2>adminuser page</h2>
      <div class="top-radio-selecter">
        <el-radio-group size="medium" v-model="action" @change="actionChange">
          <el-radio-button :label="actionPurchase"></el-radio-button>
          <el-radio-button :label="actionCashback"></el-radio-button>
        </el-radio-group>
      </div>
      <el-alert
        :closable="false"
        :title="strAlert"
        type="info"
        show-icon>
      </el-alert>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: 0
    },
    token:{
        default:''
    }
  },
  components: {},
  data() {
    return {
      name: '',
      action: '',
      strAlert: ''
    }
  },
  computed: {
    actionPurchase() {
      return 'purchase'
    },
    actionCashback() {
      return 'cashback'
    },
    strActionPurchase(){
        return '列举换币交易, USDT换' + this.token
    },
    strActionCashback(){
        return this.token + '兑换回USDT'
    }
  },
  beforeMount() {
    console.log('value: ', this.value)
    this.strAlert = this.strActionPurchase
    this.action =  this.actionPurchase
  },
  methods: {
    actionChange() {
      console.log('change')
      if(this.action === this.actionPurchase){
          this.strAlert= this.strActionPurchase;
      }else{
          this.strAlert= this.strActionCashback;
      }
    }
  }
}
</script>
