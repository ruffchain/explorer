<style lang="scss" scoped>
.subscribed-user {
  .el-alert {
    margin: 20px 0;
  }
}
</style>

<template>
  <div class="subscribed-user">
    <section>
      <h2>subscribed user page</h2>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: 0
    }
  },
  components: {},
  data() {
    return {
      name: ''
    }
  },
  computed: {},
  beforeMount() {
    console.log('')
  },
  methods: {}
}
</script>
