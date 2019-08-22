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
        <el-button :loading="loading" type="primary" @click="getCandy">
          领取 Token
        </el-button>
      </el-form-item>
    </el-form>
    <div></div>

    <div class="message-box">
      <div v-if="getCandyRes">
        <div v-if="getCandyRes.stauts === 0 || getCandyRes.status === 0">
          领取成功 ，查看本次交易
          <a target="_blank" :href="`/tx/${getCandyRes.hash}`">
            {{ getCandyRes.hash }}
          </a>
        </div>
        <div v-if="getCandyRes.status === 1">
          你已经领取过token
        </div>
      </div>
      <div v-if="getCandyFaild">领取失败，请稍后重试</div>
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
        address: ''
      },
      formRules: {
        address: [rules.required(), rules.validAdress()]
      },
      loading: false,
      getCandyFaild: false,
      getCandyRes: null
    }
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
          token: 'SYS'
        })
        .then(res => {
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
    }
  }
}
</script>
