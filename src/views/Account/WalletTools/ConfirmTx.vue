<template>
  <el-dialog :title="strTitle" :visible="visible" @update:visible="close" width="600px">
    <JsonTreeView :data="tx" />
    <div slot="footer" class="dialog-footer">
      <el-button type="default" @click="close">{{strCancel}}</el-button>
      <el-button type="primary" @click="confirm">{{ strConfirm }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import JsonTreeView from '@/components/JsonTreeView/JsonTreeView'
export default {
  components: {
    JsonTreeView,
  },
  props: {
    visible: {},
    tx: {},
  },
  computed: {
    strTitle() {
      return this.$t('ConfirmTx.title')
    },
    strCancel() {
      return this.$t('ConfirmTx.cancel')
    },
    strConfirm() {
      return this.$t('ConfirmTx.confirm')
    },
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$emit('confirm', this.tx)
      this.close()
    },
  },
}
</script>
