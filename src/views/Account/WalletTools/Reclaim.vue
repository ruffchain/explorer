<style lang="scss" scoped>
.reclaim-view {
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
    flex: 1;
  }
}
</style>

<template>
  <div class="mintage-view">
    <loading-container :loading="loading"> </loading-container>
  </div>
</template>

<script>
import * as chainApi from '../../../common/chain-api'
import LoadingContainer from '../../../components/LoadingContainer.vue'

export default {
    components:{
        LoadingContainer,
    },
    data(){
        return {

        }
    },
    mounted(){},
    beforeMount(){

    },
    computed:{},
    methods:{
        
    }
}
</script>
