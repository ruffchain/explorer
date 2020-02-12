<style lang="scss" scoped>
.bps-list {
  font-size: 16px;
  .main-content {
    min-height: 200px;
  }
  .bp-row-header {
    text-align: center;
    font-weight: bolder;
    border-bottom: solid 1px #eee;
  }
  .bp-row {
    border-bottom: solid 1px #eee;
    text-align: center;
    display: flex;
    & > div {
      padding: 15px 5px;
    }
    .working-bp {
      display: block;
      margin-top: 10px;
      border-radius: 6px;
      background: rgba(68, 197, 142, 0.1);
      color: #44c58e;
      padding: 5px;
    }
    .rank {
      // flex: 1;
      display: flex;
      align-items: center;
      width: 80px;
      .rank-tag {
        display: inline-block;
        padding: 0 10px;
        border-radius: 6px;
        background: rgba(255, 149, 0, 0.1);
        color: #ff9500;
      }
      .top-rank-tag {
        background: rgba(68, 197, 142, 0.1);
        color: #44c58e;
      }
      // text-align: left;
    }
    .vertical-center {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .name {
      flex: 1;
    }
    .address {
      flex: 1;
    }
    .website {
      flex: 1;
    }
    .votes {
      width: 80px;
      text-align: right;
    }
  }
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>

<template>
  <LoadingContainer class="card bps-list" :loading="loading">
    <span class="title"> 超级节点列表 </span>
    <ul class="main-content">
      <li class="bp-row bp-row-header">
        <div class="rank">排名</div>
        <div class="name">名称</div>
        <div class="address">地址</div>

        <div class="votes">得票数</div>
      </li>
      <li v-for="(bp, index) in bpList" :key="index" class="bp-row">
        <div class="rank vertical-center">
          <span class="rank-tag" :class="{ 'top-rank-tag': index < 21 }">
            {{ index + 1 }}
          </span>
          <span v-if="bp.candidate === workingBp" class="working-bp">
            出块中
          </span>
        </div>
        <div class="name vertical-center">{{ bp.name | slice(1) }}</div>
        <div class="address vertical-center">
          <!-- <div>
            <a :href="bp.url.slice(1)" target="_blank">
              {{ bp.url | slice(1) }}
            </a>
          </div> -->

          <router-link
            :to="'/address/' + bp.candidate.slice(1)"
          >{{$_APP.ADDRESS_PREFIX }}{{ bp.candidate | slice(1) }}</router-link>
        </div>
        <!-- <div class="website">
          <a :href="bp.website" target="_blank">{{ bp.website }}</a>
        </div> -->
        <div class="votes vertical-center">{{ bp.vote.slice(1) }}</div>
      </li>
    </ul>
    <!-- <div class="pagination-container">
      <el-pagination
        @size-change="updateBPs"
        @current-change="updateBPs"
        :current-page.sync="page"
        :page-size.sync="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total,sizes,prev, pager, next, jumper"
        :total="20"
      />
    </div> -->
  </LoadingContainer>
</template>

<script>
import * as chainApi from '../../common/chain-api.js'
import LoadingContainer from '../../components/LoadingContainer'
import { delay } from '../../common/utils'

export default {
  components: {
    LoadingContainer
  },
  data() {
    return {
      loading: true,
      bpList: [],
      workingBp: '',
      page: 1,
      pageSize: 10
    }
  },
  created() {
    this.updateBPs()
  },
  beforeDestroy() {
    this.destory = true
  },
  methods: {
    async updateBPs() {
      while (!this.destory) {
        try {
          const res = await chainApi.getCandidates()
          this.bpList = res.candidates
          this.workingBp = res.curMiner
          this.loading = false
        } catch (e) {}
        await delay(5000)
      }
    }
  }
}
</script>
