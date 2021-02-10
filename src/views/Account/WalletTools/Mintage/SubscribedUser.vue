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
      <h2>Subscribed user page: {{ value }} {{ strToken }}</h2>
      <el-alert :closable="false" :title="strAlert" type="info" show-icon>
      </el-alert>
      
    </section>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: 0
    },
    token: {
      default: ''
    }
  },
  components: {},
  data() {
    return {
      name: '',
      strAlert: '将' + this.token + '兑换成USDT'
    }
  },
  computed: {
    strToken() {
      return this.token
    }
  },
  beforeMount() {
    console.log('value:', this.value)
  },
  methods: {}
}
</script>
