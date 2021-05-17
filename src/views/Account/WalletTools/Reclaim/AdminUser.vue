<style lang="scss" scoped>
.admin-user {
  .el-alert {
    margin: 20px 0;
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
}

.warning-row {
  color: red;
  background: rgb(231, 11, 22);
}
.success-row {
  color: brown;
  background: #da9619;
}
</style>

<template>
  <div class="admin-user">
      <section>
        <el-alert :closable="false" :title="strAlert" type="info" show-icon>
      </el-alert>

      </section>

  </div>
</template>

<script>
import LoadingContainer from '@/components/LoadingContainer'
import * as chainApi from '../../../../common/chain-api'
import * as chainLib from '../../../../common/chain-lib'
import ConfirmTx from '../ConfirmTx'
import AppDialog from '../../../../components/AppDialog'
import TransactionResult from '../TransactionResult'
import { getStatus, getDataReclaims } from './utils'

export default {
  components:{
    LoadingContainer,
    ConfirmTx,
    AppDialog,
    TransactionResult
  },
  data(){
    return{
      strAlert: '',
      loading: false,
      page:1,
      pageSize:5,
      reclaims:{
        total:0,
        data:[]
      }
    }
  },
  computed:{
    dataReclaims() {
      return getDataReclaims(this.reclaims.data)
    },
  }
}
</script>
