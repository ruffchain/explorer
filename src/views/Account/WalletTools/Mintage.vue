<style lang="scss" scoped>
.mintage-view {
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
    flex:1
  }
}
</style>

<template>
  <div class="mintage-view">
    <loading-container :loading="loading">
    </loading-container>
    <!-- <section v-if="bNormalUser === true">
      <h1>参加RUSDT项目,... bla bla bla</h1>
    </section> -->
    <SubscribedUser v-if="bSubscribedUser === true" :value="value" :token="mintageToken"  :mintageAddr="mintageAddr" :mintageToken="mintageToken">
    </SubscribedUser>
    <!-- <AdminUser v-if="bAdminUser === true" :value="value" :token="mintageToken" :mintageAddr="mintageAddr" :mintageToken="mintageToken"> </AdminUser> -->
  </div>
</template>

<script>
import * as chainApi from '../../../common/chain-api'
import LoadingContainer from '../../../components/LoadingContainer.vue'
// import * as chainLib from '../../../common/chain-lib'
// import AdminUser from './Mintage/AdminUser'
import SubscribedUser from './Mintage/SubscribedUser'

export default {
  components: {
    // AdminUser,
    SubscribedUser,
    LoadingContainer
  },
  data() {
    return {
      address: '',
      value: 0,
      mintageToken: '',
      mintageAddr: '',
      tokenList: [],
      bSubscribedUser: false,
      bNormalUser: false,
      bAdminUser: false,
      loading: false,
    }
  },
  mounted() {},
  beforeMount() {
    //console.log('Mintage before Mount')
    // get
    //console.log('cur addr:', this.$_APP.address)
    this.address = this.$_APP.address
    // get token, address from server
    this.updateMintageConfig()
  },
  computed: {},
  methods: {
    async updateMintageConfig(){
      this.loading = true
      chainApi.getPurchasedConfig()
        .then(res=>{
          //console.log(res)
          if(res.err ===0){
            this.mintageToken = res.data.mintage_token
            this.mintageAddr = res.data.mintage_account

            this.chooseUser()
          }
        })
        .finally(()=>{
          //console.log('get config done')
          this.loading = false
        })
    },
    async chooseUser() {
      try {
        let tokens = await chainApi.getTokensByAddress(this.address)
        //console.log('tokens: ', tokens)

        let token = tokens.find(tok => {
          return tok.token === "RUFF"
        })
        console.log(token)

        this.value = token.value;
        this.bNormalUser = false;
        this.bSubscribedUser = true;
        this.bAdminUser = false;

      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
