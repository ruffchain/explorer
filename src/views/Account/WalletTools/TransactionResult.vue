<style lang="scss" scoped>
.transaction-result {
}
</style>

<template>
  <div class="transaction-result">
    <div>{{ data.message }}</div>
    <JsonTreeView v-if="data.json" :data="data.json" />
  </div>
</template>

<script>
import JsonTreeView from '@/components/JsonTreeView/JsonTreeView'
export default {
  components: {
    JsonTreeView
  },
  props: {
    data: {}
  }
}
</script>
