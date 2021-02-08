<style lang="scss" scoped>
.mintage-view {
  .section-title {
    font-weight: bolder;
    color: #559ef8;
  }
  .freeze-list {
    margin: 5px 0;
    .freeze-row {
      display: flex;
      border: solid 1px #eee;
      border-top: none;
      padding: 10px 20px;
    }
    .freeze-header {
      font-weight: bolder;
      border-top: solid 1px #eee;
      background: #efefef;
    }
    .time {
      flex: 1;
    }
    .amount {
      flex: 1;
    }
    .status {
      flex: 1;
    }
  }
}
</style>

<template>
  <div class="mintage-view">
    <section>
      <div class="top-radio-selecter"></div>
      <h1>Hi</h1>
    </section>
  </div>
</template>

<script>
import * as chainApi from '../../../common/chain-api'
import * as chainLib from '../../../common/chain-lib'

export default {
  components: {},
  data() {
    return {
      mintageToken: '',
      mintageAddr: '',
      tokenList: []
    }
  },
  mounted() {},
  beforeMount() {
    console.log('Mintage before Mount')
    // get
    console.log('cur addr:', this.$_APP.address)
  },
  computed: {},
  methods: {}
}
</script>
