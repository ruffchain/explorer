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

      <!-- 展示表格 -->
      <LoadingContainer :loading="loading" v-if="action === actionInvalid">
        <div>
          <el-table
            :data="dataReclaims"
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left"  class="demo-table-expand" label-width="150px">
                  <el-form-item label="Ruff Addr:">
                    <span>{{ props.row.ruffAddr }}</span>
                  </el-form-item>
                  <el-form-item label="Heco Tx:">
                    <span>{{ props.row.hecoTx }}</span>
                  </el-form-item>
                  <el-form-item label="Exchange Amount:">
                    <span>{{ props.row.value }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.ruffTx" label="Ruff TxHash:">
                    <span>{{ props.row.ruffTx }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="hecoAddr" label="Heco地址" width="400">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="150">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
          </el-table>
          <div
            class="pagination-container"
            v-if="reclaims && reclaims.total > 0"
          >
            <el-pagination
              @size-change="updateInvalidReclaim"
              @current-change="updateInvalidReclaim"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[5, 10]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="reclaims.total"
            />
          </div>
        </div>
      </LoadingContainer>

      <!-- accepted -->
      <LoadingContainer :loading="loading" v-if="action === actionAccepted">
        <div>
          <el-table
            :data="dataReclaims"
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left"  class="demo-table-expand" label-width="150px">
                  <el-form-item label="Ruff Addr:">
                    <span>{{ props.row.ruffAddr }}</span>
                  </el-form-item>
                  <el-form-item label="Heco Tx:">
                    <span>{{ props.row.hecoTx }}</span>
                  </el-form-item>
                  <el-form-item label="Exchange Amount:">
                    <span>{{ props.row.value }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.ruffTx" label="Heco TxHash:">
                    <span>{{ props.row.ruffTx }}</span>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      size="normal"
                      type="danger"
                      @click="handleAccepted(props.$index)"
                      style="width:120px"
                      >更新
                    </el-button>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="hecoAddr" label="Heco地址" width="400">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="150">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
          </el-table>
          <div
            class="pagination-container"
            v-if="reclaims && reclaims.total > 0"
          >
            <el-pagination
              @size-change="updateAcceptedReclaim"
              @current-change="updateAcceptedReclaim"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[5, 10]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="reclaims.total"
            />
          </div>
          <!-- button -->
        </div>
      </LoadingContainer>

      <el-dialog
        title="设置 Ruff TxHash"
        :visible="ruffTxDialogVisible"
        @update:visible="ruffTxClose"
        width="600px"
      >
        <el-form>
          <el-form-item>
            <el-input
              type="text"
              v-model="currentRuffTx"
              style="width:100%"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="default" @click="ruffTxClose">取消</el-button>
          <el-button type="primary" @click="ruffTxConfirm">确认</el-button>
        </div>
      </el-dialog>

      <!-- completed -->
      <LoadingContainer :loading="loading" v-if="action === actionCompleted">
        <div>
          <el-table
            :data="dataReclaims"
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left"  class="demo-table-expand" label-width="150px">
                  <!-- <el-form-item label="Type:">
                    <span>{{ props.row.type }}</span>
                  </el-form-item> -->
                  <el-form-item label="Ruff Addr:">
                    <span>{{ props.row.ruffAddr }}</span>
                  </el-form-item>
                  <el-form-item label="Heco Tx:">
                    <span>{{ props.row.hecoTx }}</span>
                  </el-form-item>
                  <el-form-item label="Exchange Amount:">
                    <span>{{ props.row.value }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.ruffTx" label="Ruff TxHash:">
                    <span>{{ props.row.ruffTx }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="hecoAddr" label="Heco地址" width="400">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="150">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
          </el-table>
          <div
            class="pagination-container"
            v-if="reclaims && reclaims.total > 0"
          >
            <el-pagination
              @size-change="updateCompletedReclaim"
              @current-change="updateCompletedReclaim"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[5, 10]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="reclaims.total"
            />
          </div>
        </div>
      </LoadingContainer>
<!-- rejected -->
      <LoadingContainer :loading="loading" v-if="action === actionRejected">
        <div>
          <el-table
            :data="dataReclaims"
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left"  class="demo-table-expand" label-width="150px">
                  <el-form-item label="Ruff Addr:">
                    <span>{{ props.row.ruffAddr }}</span>
                  </el-form-item>
                  <el-form-item label="Heco Tx:">
                    <span>{{ props.row.hecoTx }}</span>
                  </el-form-item>
                  <el-form-item label="Exchange Amount:">
                    <span>{{ props.row.value }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.ruffTx" label="Ruff TxHash:">
                    <span>{{ props.row.ruffTx }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" width="150">
            </el-table-column>
            <el-table-column prop="hecoAddr" label="Heco地址" width="400">
            </el-table-column>
            <el-table-column prop="value" label="数量" width="150">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
          </el-table>
          <div
            class="pagination-container"
            v-if="reclaims && reclaims.total > 0"
          >
            <el-pagination
              @size-change="updateRejectedReclaim"
              @current-change="updateRejectedReclaim"
              :current-page.sync="page"
              :page-size.sync="pageSize"
              :page-sizes="[5, 10]"
              layout="total,sizes,prev,pager,next,jumper"
              :total="reclaims.total"
            />
          </div>
        </div>
      </LoadingContainer>
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
import { getStatus, getDataReclaims, getAuthNormal } from './utils'

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
      },
      ruffTxDialogVisible: false,
      currentRuffTx:'',
      currentRuffValue:'',
      currentHecoTx:''
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

    this.updateInvalidReclaim()
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
    updateInvalidReclaim(){
      this.loading = true
      console.log('updateInvalidReclaim()')
      chainApi
        .getReclaimInvalid(this.page -1, this.pageSize, getAuthNormal(this.$_APP.privateKey))
        .then(res =>{
          console.log(res)
          if(res.err === 0){
            this.pageSize = res.data.page_size
            this.reclaims.total = res.data.page_total
            this.reclaims.data = res.data.data
          }
        })
        .finally(()=>{
          this.loading = false
        })
    },
    updateAcceptedReclaim(){
      this.loading = true
      chainApi
        .getReclaimAccepted(this.page -1, this.pageSize, getAuthNormal(this.$_APP.privateKey))
        .then(res => {
          console.log(res)
          if(res.err === 0){
            this.pageSize = res.data.page_size
            this.reclaims.total = res.data.page_total
            this.reclaims.data = res.data.data
          }
        })
        .finally(()=>{
          this.loading = false
        })
    },
    updateCompletedReclaim(){
      this.loading = true
      chainApi
        .getReclaimCompleted(this.page -1, this.pageSize, getAuthNormal(this.$_APP.privateKey))
        .then(res => {
          console.log(res)
          if(res.err === 0){
            this.pageSize = res.data.page_size
            this.reclaims.total = res.data.page_total
            this.reclaims.data = res.data.data
          }
        })
        .finally(()=>{
          this.loading = false
        })
    },
    updateRejectedReclaim(){
      this.loading = true
      chainApi
        .getReclaimRejected(this.page -1, this.pageSize, getAuthNormal(this.$_APP.privateKey))
        .then(res => {
          console.log(res)
          if(res.err === 0){
            this.pageSize = res.data.page_size
            this.reclaims.total = res.data.page_total
            this.reclaims.data = res.data.data
          }
        })
        .finally(()=>{
          this.loading = false
        })
    },
    handleAccepted(index){
      console.log(
        this.dataReclaims[index].ruffTx,
        this.dataReclaims[index].hecoTx
      )
      this.currentHecoTx = this.dataReclaims[index].hecoTx
      this.currentRuffValue = this.dataReclaims[index].value 
      this.currentRuffTx = ''
      this.ruffTxDialogVisible = true
    },
    ruffTxClose(){
      this.ruffTxDialogVisible = false
    },
    ruffTxConfirm(){
      this.loading = true
      console.log(this.currentRuffTx, this.currentRuffValue)

      console.log('ruffTxConfirm()')

      if( this.currentRuffTx.length < 20){
        this.loading = false;
        console.error('Wrong ruff Tx')
        this.ruffTxDialogVisible = false
        return
      }

      chainApi
        .completeReclaim(
          this.currentHecoTx,
          this.currentRuffTx,
          getAuthNormal(this.$_APP.privateKey)
        )
        .then( res =>{
          console.log(res)
          if(res.err ===0){
            this.updateAcceptedReclaim()
          }
        })
        .finally(() =>{
          this.loading = false
          this.ruffTxDialogVisible = false
        })
    }
  }
}
</script>
