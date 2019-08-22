<template>
  <transition name="loading-transition" mode="out-in" :appear="true">
    <div v-if="loading" class="app-loading-box">
      <Loading />
    </div>
  </transition>
</template>

<script>
import Loading from '@/components/Loading'

export default {
  props: {
    loading: {}
  },
  components: { Loading }
}
</script>

<style lang="scss" scoped>
.loading-transition {
  &-leave-active {
    transition: all 0.6s ease-in;
  }
  &-leave-to {
    opacity: 0;
  }
}
.app-loading-box {
  z-index: 999;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #00000044;
}
</style>
