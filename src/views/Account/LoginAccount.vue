<style lang="scss" scoped>
.login-account {
  text-align: center;
  .login-type {
    margin: 20px 0;
    .title {
      font-weight: bolder;
      font-size: 16px;
    }
    .el-button {
      margin-top: 10px;
    }
  }
  .err-msg {
    color: #f00;
  }
  .devider {
    border-bottom: solid 1px #ddd;
  }
  .full-width {
    width: 100%;
  }
  .main-container {
    margin-top: -30px;
  }
  input[type='file'] {
    display: none;
  }
}
</style>

<template>
  <el-dialog
    title="登录账户"
    :visible="true"
    @close="$emit('close')"
    class="login-account"
    width="400px"
  >
    <div class="main-container">
      <template v-if="!keyStore">
        <div class="login-type">
          <div class="title">私钥</div>
          <el-input type="password" v-model="privateKey"></el-input>
          <div class="err-msg" v-if="privateKeyErr">错误的秘钥</div>
          <el-button
            :disabled="privateKey.length !== 64"
            type="primary"
            class="full-width"
            @click="privateKeyLogin"
          >
            登录
          </el-button>
        </div>
        <div class="devider" />
        <div class="login-type">
          <div class="title">KeyStore 文件</div>

          <input type="file" @change="fileInputChange" ref="fileInput" />
          <el-button type="primary" class="full-width" @click="chooseKeyStore">
            选择文件
          </el-button>
        </div>
      </template>
      <template v-else>
        <div class="login-type">
          输入KeyStore密码
          <el-input type="password" v-model="password"></el-input>
          <div class="err-msg" v-if="passwordErr">KeyStore或者密码错误</div>
          <el-button
            :disabled="!password"
            type="primary"
            class="full-width"
            @click="keyStoreLogin"
          >
            登录
          </el-button>
        </div>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import * as chainLib from '../../common/chain-lib'

export default {
  data() {
    return {
      privateKey: '',
      privateKeyErr: false,
      keyStore: null,
      password: '',
      passwordErr: false
    }
  },
  methods: {
    privateKeyLogin() {
      try {
        this.privateKeyErr = false
        const address = chainLib.addressFromSecretKey(this.privateKey)
        if (!address) {
          throw new Error('privateKey err')
        }
        console.log(address)
        this.$_APP.privateKey = this.privateKey
        this.$router.push({ name: 'Wallet' })
        this.$emit('close')
      } catch (e) {
        this.privateKeyErr = true
      }
    },
    chooseKeyStore() {
      this.$refs.fileInput.click()
    },
    fileInputChange() {
      const file = this.$refs.fileInput.files[0]
      const reader = new FileReader()
      reader.onloadend = e => {
        this.keyStore = e.target.result
        console.log(e.target.result)
      }
      reader.readAsText(file)
    },
    keyStoreLogin() {
      try {
        const privateKey = chainLib.fromV3Keystore(this.keyStore, this.password)
        const address = chainLib.addressFromSecretKey(privateKey)
        if (!address) {
          throw new Error('privateKey err')
        }
        this.$_APP.privateKey = privateKey
        this.$router.push({ name: 'Wallet' })
        this.$emit('close')
        console.log(address)
      } catch (e) {
        this.passwordErr = true
      }
    }
  }
}
</script>
