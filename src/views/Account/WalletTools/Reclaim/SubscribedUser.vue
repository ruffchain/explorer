<style lang="scss" scoped>
.subscribed-user {
  .el-alert {
    margin: 20px 0;
  }
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
    // color: rgb(253, 226, 226)
    // color: rgb(185, 245, 204)
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
}
</style>

<template>
  <div class="subscribed-user">
    <section>
      <h2>Heco: {{account}}</h2>
      <el-button :type="metaMaskConnected" @click="enableMetaMask()">
        Connect MetaMask
      </el-button>
    </section>
  </div>
</template>

<script>
import LoadingContainer from '@/components/LoadingContainer'

export default {
  props: {},
  components:{
    LoadingContainer,
  },
  data(){
    return{
      loading: false,
      account: '',
      metaMaskConnected:'warning',
      textConnected:''
    }
  },
  computed:{

  },
  methods:{
    async enableMetaMask(){
      console.log("Enable MetaMask")
      if(this.metaMaskConnected === 'success'){
        return
      }
      if(typeof window.ethereum !== 'undefined'){
        const accounts = await ethereum.request({method: 'eth_requestAccounts'})
        console.log(typeof accounts[0])
        this.account = accounts[0]
        if(this.account){
          this.metaMaskConnected='success'
          console.log('account: ', this.account)
        }
      }else{
        console.log("Please install MetaMask")
        this.metaMaskConnected = 'danger'
      }
      
    },

  }
}
</script>
