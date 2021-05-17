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
      <div class="top-radio-selecter">
        <el-radio-group size="medium" v-model="action" @change="actionChange">
          <el-radio-button :label="actionInvalid"></el-radio-button>
          <el-radio-button :label="actionAccepted"></el-radio-button>
          <el-radio-button :label="actionCompleted"></el-radio-button>
          <el-radio-button :label="actionRejected"></el-radio-button>
        </el-radio-group>
      </div>

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
      action: '',
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
    actionInvalid() {
      return 'invalid'
    },
    actionAccepted() {
      return 'accepted'
    },
    actionCompleted() {
      return 'completed'
    },
    actionRejected() {
      return 'rejected'
    },
    strActionInvalid() {
      return '管理员页面: ' + '用户提交的未验证的请求'
    },
    strActionAccepted() {
      return '管理员页面: ' + '已批准的请求'
    },
    strActionCompleted() {
      return '管理员页面: ' + '已完成的请求'
    },
    strActionRejected() {
      return '管理员页面: ' + '被驳回的请求'
    },
  },
  beforeMount(){
    this.strAlert = this.strActionInvalid
    this.action = this.actionInvalid
  },
  mounted(){},
  methods:{
     actionChange() {
      console.log('change')

      if (this.action === this.actionInvalid) {
        this.strAlert = this.strActionInvalid
        this.updateInvalidReclaim()
        this.page = 1
      }  else if (this.action === this.actionAccepted) {
        this.strAlert = this.strActionAccepted
        this.updateAcceptedReclaim()
        this.page = 1
      } else if (this.action === this.actionCompleted) {
        this.strAlert = this.strActionCompleted
        this.updateCompletedReclaim()
        this.page = 1
      } else if (this.action === this.actionRejected) {
        this.strAlert = this.strActionRejected
        this.updateRejectedReclaim()
        this.page = 1
      }
    },
  }
}
</script>
