<style lang="scss" scoped>
.tx-history-view {
  .out-tag {
    color: #b47d00;
    background-color: rgba(219, 154, 4, .2);
    font-weight: 700;
    font-size: .60938rem;
    line-height: 1.7;
    padding: .2rem .5rem;
    display: inline-block;
    transition: .2s ease-in-out;
    text-transform: uppercase !important;
    text-align: center !important;
    white-space: nowrap !important;
    border-radius: .25rem !important;
  }
  .in-tag {
    color: #02977e;
    background-color: rgba(0, 201, 167, .2);
    font-weight: 700;
    font-size: .60938rem;
    line-height: 1.7;
    padding: .2rem .9rem;
    display: inline-block;
    transition: .2s ease-in-out;
    text-transform: uppercase !important;
    text-align: center !important;
    white-space: nowrap !important;
    border-radius: .25rem !important;
  }
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
</style>

<template>
  <LoadingContainer :loading="loading" class="tx-history-view">
    <div>
      <el-table :data="txs" highlight-current-row header-row-class-name="header-row" style="min-width:900px;">
          <el-table-column type="expand">
              <template slot-scope="scope">
                  <JsonTreeView :data="scope.row" />
              </template>
          </el-table-column>
          <el-table-column label="交易哈希" show-overflow-tooltip min-width="80px">
              <template slot-scope="scope">
                  <router-link :to="'/tx/' + scope.row.content.hash">
                      {{ scope.row.content.hash }}
                  </router-link>
              </template>
          </el-table-column>
          <el-table-column label="所在区块" show-overflow-tooltip min-width="60px">
              <template slot-scope="scope">
                  <router-link :to="'/block/' + scope.row.blocknumber">
                      {{ scope.row.blocknumber}}
                  </router-link>
              </template>
          </el-table-column>
          <el-table-column prop="timeAgo" label="时间" show-overflow-tooltip min-width="90px">
          </el-table-column>
          <el-table-column label="发送方" show-overflow-tooltip min-width="150px">
              <template slot-scope="scope">
                  <router-link v-if="scope.row.content.caller != address" :to="'/address/' + scope.row.address">
                      {{ scope.row.address}}
                  </router-link>
                  <span v-if="scope.row.content.caller == address">{{ scope.row.address}}</span>
              </template>
          </el-table-column>
          <el-table-column width="70px">
              <template slot-scope="scope">
                  <span v-if="scope.row.content.caller != address" class="in-tag">IN</span>
                  <span v-if="scope.row.content.caller == address" class="out-tag">OUT</span>
              </template>
          </el-table-column>
          <el-table-column label="接收方" show-overflow-tooltip min-width="150px">
              <template slot-scope="scope">
                  <span v-if="(scope.row.content.method == 'transferTo')  || (scope.row.content.method == 'transferTokenTo') || (scope.row.content.method == 'transferBancorTokenTo')">
                      <router-link v-if="scope.row.content.input.to != address" :to="'/address/' + scope.row.content.input.to">{{ scope.row.content.input.to }}</router-link>
                      <span v-if="scope.row.content.input.to == address">{{ scope.row.content.input.to }}</span>
                  </span>
                  <span v-else>{{ scope.row.content.method }}</span>
              </template>
          </el-table-column>
          <el-table-column label="价值">
              <template slot-scope="scope">
                  <span v-if="(scope.row.content.method == 'transferTokenTo') || (scope.row.content.method == 'transferBancorTokenTo')">{{ scope.row.content.input.amount }}</span>
                  <span v-else>{{ scope.row.content.value }}</span>
                  <span v-if="(scope.row.content.method == 'transferTokenTo') || (scope.row.content.method == 'transferBancorTokenTo')" class="token_label"> {{ scope.row.content.input.tokenid }} </span>
                  <span v-else> SYS </span>
              </template>
          </el-table-column>
          <el-table-column prop="content.fee" label="交易费用">
          </el-table-column>
      </el-table>
      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          @size-change="updateTxs"
          @current-change="updateTxs"
          :current-page.sync="page"
          :page-size.sync="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </div>
  </LoadingContainer>
</template>
<script>
import JsonTreeView from '@/components/JsonTreeView/JsonTreeView'
import LoadingContainer from './LoadingContainer'
import { timeAgo } from '../common/utils.js'
import * as chainApi from '../common/chain-api.js'

export default {
  props: {
    address: {}
  },
  components: {
    JsonTreeView,
    LoadingContainer
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      txs: null,
      total: 0,
      loading: false
    }
  },

  mounted() {
    this.updateTxs()
  },
  methods: {
    async updateTxs() {
      this.loading = true
      return chainApi
        .getTxsByAddress({
          address: this.address,
          page: this.page,
          pageSize: this.pageSize
        })
        .then(res => {
          res.data.forEach(item => {
            item.timeAgo = timeAgo(new Date(item.timestamp * 1000))
            return item
          })
          this.txs = res.data
          this.total = res.total
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
