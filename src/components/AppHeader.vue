<style scoped lang="scss">
.app-header {
  border-bottom: solid 1px rgba(58, 78, 103, 0.5);
  background: rgb(58, 78, 103);
  color: #fff;
  .app-header-inner {
    align-items: center;
    height: 46px;
    margin: 0 auto;
    max-width: 1200px;
  }
  .logo {
    display: block;
    margin: 0 10px;
    height: 30px;
  }
  .hd-center {
    flex: 1;
    margin: 0 10px;
    .search-input {
      max-width: 500px;
      float: right;
    }
  }
  .hd-right {
    margin: 0 10px;
    position: relative;
    .login-button {
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      border-radius: 60px;
      padding: 3px 10px;
      padding-top: 5px;
      color: inherit;
      &:hover {
        color: #409eff;
        background: rgba($color: #000000, $alpha: 0.2);
      }
      .material-design-icon {
        margin-right: 5px;
        margin-top: -3px;
      }
    }
    .account-dropdown-menu {
      position: absolute;
      right: 0;
      z-index: 999;
      border-radius: 3px;
      padding: 3px;
      border: solid 1px rgba($color: #000000, $alpha: 0.3);
      user-select: none;
      min-width: 100px;
      background: #fff;
      color: #000;
      box-shadow: 0 10px 30px rgba($color: #000000, $alpha: 0.6);
      ul > li {
        padding: 3px 10px;
        cursor: pointer;
        &:hover {
          background: rgba($color: #000000, $alpha: 0.1);
        }
      }
    }
  }
}
</style>

<template>
  <div class="app-header">
    <div class="app-header-inner layout">
      <router-link to="/">
        <img class="logo" src="@/assets/ruff-logo-white.png" />
      </router-link>
      <div class="hd-center">
        <el-input
          class="search-input"
          placeholder="区块，交易，Token，账户"
          suffix-icon="el-icon-search"
          size="small"
          v-model="searchText"
          @keydown.enter.native="search"
        ></el-input>
      </div>
      <div class="hd-right">
        <a
          class="login-button"
          ref="login"
          @click="openDropdown()"
          @blur="closeDropdown()"
          href="javascript:;"
        >
          <AccountIcon decorative class="icon-20" />
          {{ isLogin ? '钱包' : '登录' }}
        </a>
        <div v-if="showDropdown" class="account-dropdown-menu">
          <ul>
            <template v-if="!isLogin">
              <li @click="login">登录</li>
              <li @click="showCreateAccount = true">创建账户</li>
            </template>
            <template v-else>
              <li @click="viewAccount">查看账户</li>
              <li @click="logOut">退出登录</li>
            </template>
          </ul>
        </div>
      </div>
    </div>
    <CreateAccount
      v-if="showCreateAccount"
      @close="showCreateAccount = false"
    />
    <LoginAccount v-if="showLogin" @close="showLogin = false" />
  </div>
</template>

<script>
import AccountIcon from 'vue-material-design-icons/AccountCircle.vue'
import CreateAccount from '../views/Account/CreateAccount.vue'
import LoginAccount from '../views/Account/LoginAccount.vue'

export default {
  data() {
    return {
      searchText: '',
      showDropdown: false,
      showCreateAccount: false,
      showLogin: false
    }
  },
  components: {
    AccountIcon,
    CreateAccount,
    LoginAccount
  },
  computed: {
    isLogin() {
      return !!this.$_APP.privateKey
    }
  },
  methods: {
    search() {
      this.searchText &&
        this.$router.push({
          name: 'Search',
          params: { search: this.searchText.trim() },
          query: { t: new Date().getTime() }
        })
    },
    openDropdown() {
      this.$refs.login.focus()
      this.showDropdown = true
    },
    closeDropdown() {
      window.setTimeout(() => {
        this.showDropdown = false
      }, 200)
    },
    login() {
      this.showLogin = true
    },
    viewAccount() {
      this.$router.push({
        name: 'Wallet'
      })
    },
    logOut() {
      this.$_APP.privateKey = ''
    }
  }
}
</script>
