<style lang="scss">
.wallet-page {
  min-width: 960px;
  .main-container {
    display: flex;
    margin-top: -20px;
    .nav {
      width: 160px;
      .nav-item {
        padding: 5px 15px;
        margin: 2px 0;
        cursor: pointer;
        border-radius: 6px;
        &.active,
        &:hover {
          font-size: bolder;
          background: #66b1ff;
          color: #fff;
        }
      }
    }
    .container {
      flex: 1;
    }
    .devider {
      width: 10px;
      height: 10px;
    }
  }
  .top-radio-selecter {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>

<template>
  <div class="wallet-page">
    <PageBreadcrumb :title="strTitle" />
    <template v-if="$_APP.privateKey">
      <div class="card">
        <ParameterRow :name="strAddress">{{$_APP.ADDRESS_PREFIX }}{{ address }}</ParameterRow>
        <TokenList :address="address" />
      </div>
      <div class="main-container">
        <ul class="card nav">
          <li
            class="nav-item"
            v-for="item in newNavItems"
            :key="item.type"
            @click="activeNav = item.type"
            :class="{ active: activeNav === item.type }"
          >{{ item.name }}</li>
        </ul>
        <div class="devider"></div>
        <div class="card container">
          <AddressTxHistory v-if="activeNav === NavItemEnums.History" :address="address" />
          <TransferToken v-if="activeNav === NavItemEnums.Transfer" />
          <CreateToken v-if="activeNav === NavItemEnums.CreateToken" />
          <TokenExchange v-if="activeNav === NavItemEnums.Exchange" />
          <Vote v-if="activeNav === NavItemEnums.Vote" />
        </div>
      </div>
    </template>
    <div v-else>{{ strUnlogin }}</div>
  </div>
</template>

<script>
import PageBreadcrumb from '@/components/PageBreadcrumb'
import ParameterRow from '@/components/ParameterRow'
import TokenList from '@/components/TokenList'
import AddressTxHistory from '@/components/AddressTxHistory'
import TransferToken from './WalletTools/TransferToken'
import CreateToken from './WalletTools/CreateToken'
import TokenExchange from './WalletTools/TokenExchange'
import Vote from './WalletTools/Vote'

const NavItemEnums = {
  History: 'History',
  Transfer: 'Transfer',
  CreateToken: 'CreateToken',
  Exchange: 'Exchange',
  Vote: 'Vote',
}

export default {
  components: {
    PageBreadcrumb,
    ParameterRow,
    TokenList,
    AddressTxHistory,
    TransferToken,
    CreateToken,
    TokenExchange,
    Vote,
  },
  data() {
    return {
      activeNav: NavItemEnums.History,
    }
  },
  computed: {
    address() {
      return this.$_APP.address
    },
    strTitle() {
      return this.$t('Wallet.title')
    },
    strAddress() {
      return this.$t('Wallet.addressAccount')
    },
    strUnlogin() {
      return this.$t('Wallet.addressUnlogin')
    },
    strHistory() {
      return this.$t('Wallet.history')
    },
    strTransfer() {
      return this.$t('Wallet.transfer')
    },
    strCreateToken() {
      return this.$t('Wallet.create')
    },
    strExchange() {
      return this.$t('Wallet.exchange')
    },
    strVote() {
      return this.$t('Wallet.vote')
    },
    newNavItems() {
      return [
        {
          type: NavItemEnums.History,
          name: this.strHistory,
        },
        {
          type: NavItemEnums.Transfer,
          name: this.strTransfer,
        },
        {
          type: NavItemEnums.CreateToken,
          name: this.strCreateToken,
        },
        {
          type: NavItemEnums.Exchange,
          name: this.strExchange,
        },
        {
          type: NavItemEnums.Vote,
          name: this.strVote,
        },
      ]
    },
  },
  beforeMount() {
    this.NavItemEnums = NavItemEnums
  },
}
</script>
