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
    <section v-if="bNormalUser === true">
      <h1>参加RUSDT项目,... bla bla bla</h1>
    </section>
    <SubscribedUser v-if="bSubscribedUser === true" :value="value" :token="mintageToken"  :mintageAddr="mintageAddr" :mintageToken="mintageToken">
    </SubscribedUser>
    <AdminUser v-if="bAdminUser === true" :value="value" :token="mintageToken" :mintageAddr="mintageAddr" :mintageToken="mintageToken"> </AdminUser>
  </div>
</template>

<script>
import * as chainApi from '../../../common/chain-api'
// import * as chainLib from '../../../common/chain-lib'
import AdminUser from './Mintage/AdminUser'
import SubscribedUser from './Mintage/SubscribedUser'

export default {
  components: {
    AdminUser,
    SubscribedUser
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
      bAdminUser: false
    }
  },
  mounted() {},
  beforeMount() {
    console.log('Mintage before Mount')
    // get
    console.log('cur addr:', this.$_APP.address)
    this.address = this.$_APP.address
    this.mintageAddr = '1t7yJ98894ttf2U9UuRbx3rkWzF6ASd6W'
    this.mintageToken = 'AEIT'
    console.log('mintage addr:', this.mintageAddr)
    console.log('mintageToken: ', this.mintageToken)

    this.chooseUser()
  },
  computed: {},
  methods: {
    async chooseUser() {
      try {
        let tokens = await chainApi.getTokensByAddress(this.address)
        // console.log('tokens: ', tokens)

        let token = tokens.find(tok => {
          return tok.token === this.mintageToken
        })
        console.log(token)
        if (token === undefined) {
          this.bNormalUser = true
        } else {
          this.value = token.value
          if (this.address === this.mintageAddr) {
            this.bAdminUser = true
          } else {
            this.bSubscribedUser = true
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
