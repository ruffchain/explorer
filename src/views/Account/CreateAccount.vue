<style lang="scss">
.create-account {
  .el-dialog__header {
    text-align: center;
  }
  .row-box {
    margin: 5px 0;
  }
  .password-line {
    display: flex;
    .el-input {
      flex: 1;
    }
    .el-button {
      margin-left: 10px;
    }
  }
  .full-width {
    width: 100%;
  }
}
</style>

<template>
  <el-dialog
    title="创建账户"
    :visible="true"
    @close="$emit('close')"
    width="600px"
    class="create-account"
  >
    <el-steps :active="step" style="margin-bottom:40px;">
      <el-step></el-step>
      <el-step></el-step>
      <el-step></el-step>
    </el-steps>

    <template v-if="step === 1">
      输入密码,此密码用于加密私钥，不作为生成私钥的种子。
      您需要使用此密码及私钥才能解锁钱包。
      <el-form ref="form" :model="formData" :rules="formRules" label-width="0">
        <el-form-item prop="password" label>
          <el-input v-model="formData.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
    </template>

    <template v-if="step === 2">
      <el-button type="primary" class="full-width" @click="download">下载KeyStore文件</el-button>
    </template>

    <template v-if="step === 3">
      <div>请保存好你的私钥:</div>
      {{ privateKey }}
      <el-button
        @click="copyPrivateKey"
        type="primary"
        icon="el-icon-document-copy"
        size="mini"
        circle
      ></el-button>

      <template v-if="$_APP.IS_TESTNET">
        <el-button
          v-if="!getCandyRes"
          :loading="loading"
          type="primary"
          @click="getCandy"
        >点击领取 Token</el-button>
        <div class="message-box">
          <div v-if="getCandyRes">
            <div v-if="getCandyRes.stauts === 0 || getCandyRes.status === 0">
              领取成功 ，查看本次交易
              <a
                target="_blank"
                :href="`/tx/${getCandyRes.hash}`"
              >{{ getCandyRes.hash }}</a>
            </div>
            <div v-if="getCandyRes.status === 1">你已经领取过token</div>
          </div>
          <div v-if="getCandyFaild">领取失败，请稍后重试</div>
        </div>
      </template>
    </template>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="disableNext || loading" @click="nextStep">下一步</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { downloadString, copyText } from '../../common/utils'
import * as chainLib from '../../common/chain-lib'
import * as chainApi from '../../common/chain-api.js'
import * as rules from './WalletTools/form-rules'

export default {
  data() {
    return {
      step: 1,
      privateKey: '',
      downloadClicked: false,
      loading: false,
      getCandyRes: null,
      getCandyFaild: false,
      formData: {
        password: ''
      }
    }
  },
  computed: {
    disableNext() {
      if (this.step === 1) {
        return !this.formData.password || this.formData.password.length < 8
      }
      if (this.step === 2) {
        return !this.downloadClicked
      }
      return false
    }
  },
  created() {
    const required = rules.required()
    this.formRules = {
      password: [
        required,
        {
          validator: async (rule, value, callback) => {
            let err
            if (value.length < 8) {
              err = `密码最少为8位`
            }
            err ? callback(new Error(err)) : callback()
          },
          trigger: ['change']
        }
      ]
    }
  },
  methods: {
    async nextStep() {
      if (this.step === 1) {
        await this.$refs.form.validate()
      }
      if (this.step === 3) {
        this.$_APP.privateKey = this.privateKey
        this.$router.push({ name: 'Wallet' })
        this.$emit('close')
      }
      this.step++
    },
    download() {
      let [publicKey, privateKey] = chainLib.createKeyPair()

      this.privateKey = privateKey.toString('hex')
      publicKey = publicKey.toString('hex')
      const address = chainLib.addressFromSecretKey(privateKey)
      const keyStore = chainLib.toV3Keystore(
        this.privateKey,
        address,
        this.formData.password
      )
      downloadString(JSON.stringify(keyStore), address)
      this.address = address
      this.downloadClicked = true
    },
    getCandy() {
      this.getCandyFaild = false
      this.getCandyRes = null
      this.loading = true
      chainApi
        .getCandy({
          address: this.address,
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
    },
    copyPrivateKey() {
      if (copyText(this.privateKey)) {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      } else {
        this.$message.error('复制失败，请手动复制')
      }
    }
  }
}
</script>
