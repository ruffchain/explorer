<style scoped lang="scss">
.app-footer {
  background: rgb(58, 78, 103);
  color: #fff;
  padding: 5px 0;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .divider {
    display: none;
  }
  @media (min-width: 768px) {
    & {
      flex-direction: row;
      .divider {
        display: initial;
      }
    }
  }
  a {
    color: #fff;
    text-decoration: underline;
  }
}
</style>

<template>
  <div class="app-footer">
    Copyright ©2019 RUFF FOUNDATION LTD. All Rights Reserved
    <div>
      <span class="divider">|</span>
      <a target="_blank" href="https://github.com/ruffchain/Guide/wiki">{{strHelpCenter}}</a>
      <!-- |
      <router-link to="/tools/address2hex">
        地址转换工具
      </router-link>-->
      |
      <a target="_blank" href="https://ruffchain.com/plan-early-birds/profit/">{{strEarlyBird}}</a>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    strHelpCenter() {
      return this.$t('AppFooter.helpCenter')
    },
    strEarlyBird() {
      return this.$t('AppFooter.earlyBird')
    },
  },
}
</script>
