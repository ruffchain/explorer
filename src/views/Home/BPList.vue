<style lang="scss" scoped>
.bps-list {
  font-size: 14px;
  .title{
    font-size: 14px;
    margin-bottom: 0px;
  }
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
      width: 120px;
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
      flex-direction: center;
      justify-content: center;
    }
    .name {
      flex: 1;
      a{
        color: #3498DB;
      }
    }
    .address {
      flex: 1;
      a{
        color: #3498DB;
      }
    }
    .website {
      flex: 1;
    }
    .votes {
      
      width: 80px;
      text-align: right;
      // background-color: #77838F1A;

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
    <span class="title">{{ strTitle}}</span>
    <ul class="main-content">
      <li class="bp-row bp-row-header">
        <div class="rank">{{ strRank}}</div>
        <div class="name">{{strName}}</div>
        <div class="address">{{ strAddress}}</div>

        <div class="votes">{{ strVotes }}</div>
      </li>
      <li v-for="(bp, index) in bpList" :key="index" class="bp-row">
        <div class="rank vertical-center">
          <!-- <span class="rank-tag" :class="{ 'top-rank-tag': index < 21 }">{{ index + 1 }}</span> -->
          <span v-if="bp.candidate === workingBp" class="rank-tag" :class="{ 'top-rank-tag': index < 21 }"> {{ index + 1 }} {{ strWorking}}</span>
          <span v-else class="rank-tag" :class="{ 'top-rank-tag': index < 21 }">
            {{ index + 1 }}
          </span>
        </div>
        <div class="name vertical-center"> <a>{{ bp.name | slice(1) }}</a></div>
        <div class="address vertical-center">
          <!-- <div>
            <a :href="bp.url.slice(1)" target="_blank">
              {{ bp.url | slice(1) }}
            </a>
          </div>-->

          <router-link
            :to="'/address/' + bp.candidate.slice(1)"
          >{{$_APP.ADDRESS_PREFIX }}{{ bp.candidate | slice(1) }}</router-link>
        </div>
        <!-- <div class="website">
          <a :href="bp.website" target="_blank">{{ bp.website }}</a>
        </div>-->
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
    </div>-->
  </LoadingContainer>
</template>

<script>
import * as chainApi from '../../common/chain-api.js'
import LoadingContainer from '../../components/LoadingContainer'
import { delay } from '../../common/utils'

export default {
  components: {
    LoadingContainer,
  },
  data() {
    return {
      loading: true,
      bpList: [],
      workingBp: '',
      page: 1,
      pageSize: 10,
    }
  },
  created() {
    this.updateBPs()
  },
  beforeDestroy() {
    this.destory = true
  },
  computed: {
    strTitle() {
      return this.$t('BPList.title')
    },
    strRank() {
      return this.$t('BPList.rank')
    },
    strName() {
      return this.$t('BPList.name')
    },
    strAddress() {
      return this.$t('BPList.address')
    },
    strVotes() {
      return this.$t('BPList.votes')
    },
    strWorking() {
      return this.$t('BPList.working')
    },
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
        await delay(10000)
      }
    },
  },
}
</script>
