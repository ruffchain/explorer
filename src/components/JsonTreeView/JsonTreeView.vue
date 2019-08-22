<template>
  <div class="json-tree-view-wrapper">
    <JsonView :data="data" />
  </div>
</template>

<script>
import JsonView from 'vue-json-views'
export default {
  components: {
    JsonView
  },
  props: ['data']
}
</script>

<style lang="scss" >
.json-tree-view-wrapper {
  overflow-x: auto;
  line-height: 1.5;
  padding: 1em;
  border-radius: 6px;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  background: #f2f2f2;
}
.json-view-container {
  background-color: inherit !important;
  .json-view {
    .json-key {
      color: #f00 !important;
    }
    .json-note {
      color: #888 !important;
    }
    .json-value {
      color: #00b1f1 !important;

      &.string {
        color: #00b1f1 !important;
      }
      &.null,
      &.boolean,
      &.number {
        color: #ea6200 !important;
      }
    }
  }
}
</style>
