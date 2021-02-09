<style lang="scss" scoped>
.admin-user {
  .el-alert {
    margin: 20px 0;
  }
}
</style>

<template>
  <div class="admin-user">
    <section>
      <h2>adminuser page</h2>
    </section>
  </div>
</template>

<script>
export default {
  props:{
      value:{
          default: 0
      }
  },
  components: {},
  data() {
      return{
          name:''
      }
  },
  computed: {},
  beforeMount() {
      console.log('value: ', this.value)
  },
  methods: {}
}
</script>
