<style lang="scss" scoped>
.loading-container {
  position: relative;
  &.show-loading {
    min-height: 100px;
  }
  .loading-box {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba($color: #000000, $alpha: 0.1);
  }
}
</style>
<template>
  <div class="loading-container" :class="{ 'show-loading': loading }">
    <slot />
    <div v-if="loading" class="loading-box">
      <Loading />
    </div>
  </div>
</template>

<script>
import Loading from './Loading'
export default {
  props: {
    loading: {
      default: false
    }
  },
  components: {
    Loading
  }
}
</script>
