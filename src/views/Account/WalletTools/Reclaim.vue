<style lang="scss" scoped>
.reclaim-view {
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
    flex: 1;
  }
}
</style>

<template>
  <div class="mintage-view">
    <loading-container :loading="loading"> </loading-container>
    <SubscribedUser v-if="bSubscribedUser === true" :ruffAddr="address"></SubscribedUser>
    <AdminUser v-if="bAdminUser === true"></AdminUser>
  </div>
</template>

<script>
import * as chainApi from '../../../common/chain-api'
import LoadingContainer from '../../../components/LoadingContainer.vue'
import AdminUser from './Reclaim/AdminUser'
import SubscribedUser from './Reclaim/SubscribedUser'

export default {
  components: {
    LoadingContainer,
    AdminUser,
    SubscribedUser
  },
  data() {
    return {
      address: '',
      bSubscribedUser: false,
      bNormalUser: false,
      bAdminUser: false,
      loading: false,
      mintageAddr:'',
      otherAddr:''
    }
  },
  mounted() {},
  beforeMount() {
    console.log('Reclaim page beforeMount')
    this.address = this.$_APP.address

    console.log('this.address: ', this.address)
    this.chooseUser();
  },
  computed: {},
  methods: {
      async chooseUser(){
          this.loading = true
            chainApi.getPurchasedConfig()
                .then(res=>{
                    console.log(res)
                    this.mintageAddr = res.data.mintage_account;
                    this.otherAddr = res.data.mintage_other_addr;

                    this.bAdminUser = this.address === this.otherAddr;
                    this.bSubscribedUser = !this.bAdminUser
                })
                .finally(()=>{
                    this.loading = false
                })
      }
  }
}
</script>
