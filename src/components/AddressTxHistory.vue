<style lang="scss" scoped>
.tx-history-view {
  ul.tx-list {
    .list-header {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: solid 1px #eee;
    }
    li {
      margin: 5px 0;
    }
    .el-col {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .empty-view {
      display: flex;
      height: 100px;
      align-items: center;
      justify-content: center;
    }
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
      <ul class="tx-list">
        <el-row class="text-center list-header" tag="li">
          <el-col :span="4">交易哈希</el-col>
          <el-col :span="3">所在区块</el-col>
          <el-col :span="3">时间</el-col>
          <el-col :span="12">交易内容</el-col>
          <el-col :span="2" class="text-right">Gasfee</el-col>
        </el-row>

        <template v-if="txs">
          <el-row v-for="tx in txs.data" :key="tx.hash" type="flex" tag="li">
            <el-col :span="4">
              <div class="text-ellipsis">
                <router-link :to="`/tx/${tx.hash}`">
                  {{ tx.hash }}
                </router-link>
              </div>
            </el-col>
            <el-col :span="3" class="text-center">
              <router-link :to="`/block/${tx.blocknumber}`">
                {{ tx.blocknumber }}
              </router-link>
            </el-col>
            <el-col :span="3" class="text-center">
              {{ tx.timestamp | ms | dateformat('YYYY-MM-DD HH:mm:ss') }}
              <div></div>
              {{ tx.timeAgo }}
            </el-col>
            <el-col :span="12">
              <JsonTreeView :data="tx.content" />
            </el-col>
            <el-col :span="2" class="text-right">
              {{ tx.content.fee }} SYS
            </el-col>
          </el-row>
        </template>
        <div v-if="!loading && txs && txs.data.length === 0" class="empty-view">
          记录为空
        </div>
      </ul>

      <div class="pagination-container" v-if="txs && txs.total > 0">
        <el-pagination
          @size-change="updateTxs"
          @current-change="updateTxs"
          :current-page.sync="page"
          :page-size.sync="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="txs.total"
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
          this.txs = res
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
