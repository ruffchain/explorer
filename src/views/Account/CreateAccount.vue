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
    :title="strTitle"
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
      {{ strStep1}}
      <el-form ref="form" :model="formData" :rules="formRules" label-width="0">
        <el-form-item prop="password" label>
          <el-input v-model="formData.password" type="password" :placeholder="strPlaceHolder"></el-input>
        </el-form-item>
      </el-form>
    </template>

    <template v-if="step === 2">
      <el-button type="primary" class="full-width" @click="download">{{ strDownloadKeyStore}}</el-button>
    </template>

    <template v-if="step === 3">
      <div>{{ strSavePrivateKey }}</div>
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
        >{{ strGetCandy }}</el-button>
        <div class="message-box">
          <div v-if="getCandyRes">
            <div v-if="getCandyRes.stauts === 0 || getCandyRes.status === 0">
              {{ strGetCandyOK }}
              <a
                target="_blank"
                :href="`/tx/${getCandyRes.hash}`"
              >{{ getCandyRes.hash }}</a>
            </div>
            <div v-if="getCandyRes.status === 1">{strGetCandyAlready}}</div>
          </div>
          <div v-if="getCandyFaild">{{ strGetCandyFail }}</div>
        </div>
      </template>
    </template>

    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        :disabled="disableNext || loading"
        @click="nextStep"
      >{{ strNextStep }}</el-button>
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
        password: '',
      },
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
    },
    strTitle() {
      return this.$t('CreateAccount.title')
    },
    strStep1() {
      return this.$t('CreateAccount.step1')
    },
    strPlaceHolder() {
      return this.$t('CreateAccount.placeHolder')
    },
    strDownloadKeyStore() {
      return this.$t('CreateAccount.downloadKeyStore')
    },
    strSavePrivateKey() {
      return this.$t('CreateAccount.savePrivateKey')
    },
    strGetCandy() {
      return this.$t('CreateAccount.getCandy')
    },
    strGetCandyOK() {
      return this.$t('CreateAccount.getCandyOK')
    },
    strGetCandyAlready() {
      return this.$t('CreateAccount.getCandyAlready')
    },
    strGetCandyFail() {
      return this.$t('CreateAccount.getCandyFail')
    },
    strNextStep() {
      return this.$t('CreateAccount.nextStep')
    },
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
              err = this.$t('CreateAccount.validatorErr')
            }
            err ? callback(new Error(err)) : callback()
          },
          trigger: ['change'],
        },
      ],
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
    copyPrivateKey() {
      if (copyText(this.privateKey)) {
        this.$message({
          message: this.$t('CreateAccount.copyPrivateKeyOk'),
          type: 'success',
        })
      } else {
        this.$message.error(this.$t('CreateAccount.copyPrivateKeyFail'))
      }
    },
  },
}
</script>
