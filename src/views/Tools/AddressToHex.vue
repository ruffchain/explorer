<style lang="scss" scoped>
.address-to-hex {
}
</style>

<template>
  <div class="address-to-hex">
    <PageBreadcrumb title="地址转换工具" />
    <div class="card">
      <el-form
        ref="form"
        :model="formData"
        :rules="formRules"
        label-width="90px"
      >
        <el-form-item prop="address" label="地址">
          <el-input v-model="formData.address"></el-input>
        </el-form-item>
        <el-form-item v-if="output">
          <div class="output">
            {{ output }}
            <el-button
              @click="copyText"
              type="primary"
              icon="el-icon-copy-document"
              size="mini"
              circle
            ></el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="translate">
            转换为16进制(HEX)
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import PageBreadcrumb from '../../components/PageBreadcrumb'
import * as rules from '../Account/WalletTools/form-rules'
import { copyText } from '../../common/utils'
export default {
  components: { PageBreadcrumb },
  data() {
    return {
      formData: { address: '' },
      formRules: {
        address: [rules.required(), rules.validAdress()]
      },
      output: null
    }
  },
  methods: {
    translate() {
      this.output = null
      this.$refs.form
        .validate()
        .then(() => {
          const charList = [...this.formData.address]
          var hexList = charList.map(char => {
            return char.charCodeAt(0).toString(16)
          })
          this.output = hexList.join('')
        })
        .catch(e => {})
    },
    copyText() {
      if (copyText(this.output)) {
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
