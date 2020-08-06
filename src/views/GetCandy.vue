<style lang="scss" scoped>
.get-candy-page {
  height: 100%;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // flex-direction: column;
  .el-form {
    margin-top: 100px;
  }
}
</style>
<template>
  <div class="get-candy-page">
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item prop="address" label="地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="getCandy">{{strToken}}</el-button>
      </el-form-item>
    </el-form>
    <div></div>

    <div class="message-box">
      <div v-if="getCandyRes">
        <div v-if="getCandyRes.stauts === 0 || getCandyRes.status === 0">
          {{strSuccess}}
          <a target="_blank" :href="`/tx/${getCandyRes.hash}`">{{ getCandyRes.hash }}</a>
        </div>
        <div v-if="getCandyRes.status === 1">{{strAlready}}</div>
      </div>
      <div v-if="getCandyFaild">{{strFail}}</div>
    </div>
  </div>
</template>

<script>
import * as chainApi from '../common/chain-api'
import * as rules from './Account/WalletTools/form-rules'

export default {
  data() {
    return {
      form: {
        address: '',
      },
      formRules: {
        address: [rules.required(), rules.validAdress()],
      },
      loading: false,
      getCandyFaild: false,
      getCandyRes: null,
    }
  },
  computed: {
    strToken() {
      return this.$t('GetCandy.getToken')
    },
    strSuccess() {
      return this.$t('GetCandy.getSuccess')
    },
    strAlready() {
      return this.$t('GetCandy.getAlready')
    },
    strFail() {
      return this.$t('GetCandy.getFail')
    },
  },
  methods: {
    async getCandy() {
      this.getCandyFaild = false
      this.getCandyRes = null
      await this.$refs.form.validate()
      this.loading = true
      chainApi
        .getCandy({
          address: this.form.address,
          token: 'SYS',
        })
        .then((res) => {
          if (res.hash) {
            this.getCandyRes = res
          } else {
            this.getCandyFaild = true
          }
        })
        .catch(() => {
          this.getCandyFaild = true
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
