<style lang="scss" scoped>
.params-block-row {
  margin: 10px 0;
  overflow: hidden;
  .params-name {
    padding-right: 5px;
  }
  .params-value {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>

<template>
  <div class="params-block-row layout-row">
    <div class="params-name">{{ name }}</div>
    <div class="params-value flex">
      <slot>{{ value }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: { default: '-' },
    value: { default: '-' }
  }
}
</script>
