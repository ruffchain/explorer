<template>
  <el-dialog
    title="确认交易内容"
    :visible="visible"
    @update:visible="close"
    width="600px"
  >
    <JsonTreeView :data="tx" />
    <div slot="footer" class="dialog-footer">
      <el-button type="default" @click="close">
        取消
      </el-button>
      <el-button type="primary" @click="confirm">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import JsonTreeView from '@/components/JsonTreeView/JsonTreeView'
export default {
  components: {
    JsonTreeView
  },
  props: {
    visible: {},
    tx: {}
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$emit('confirm', this.tx)
      this.close()
    }
  }
}
</script>
