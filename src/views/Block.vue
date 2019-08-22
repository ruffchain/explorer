<style lang="scss" scoped>
.block-detail {
  .block-num {
    font-size: 20px;
    font-weight: bolder;
    margin-bottom: 15px;
    .text {
      display: inline-block;
      margin: 0 20px;
    }
    .material-design-icon {
      cursor: pointer;
      user-select: none;
    }
  }
  .tx-row {
    padding: 20px 0;
    &:not(:last-child) {
      border-bottom: solid 1px rgba($color: #000000, $alpha: 0.1);
    }
    &-lf-part {
      margin: 15px 0;
      overflow: hidden;
      .method-name {
        display: inline-block;
        margin: 0 auto;
      }
    }
  }
}
</style>

<template>
  <div class="block-detail">
    <PageBreadcrumb title="区块详情" />
    <template v-if="data">
      <div class="card">
        <div class="block-num">
          <LeftIcon @click.native="lastBlock()" />
          <span class="text">区块 #{{ data.block.number }}</span>
          <RightIcon @click.native="nextBlock()" />
        </div>
        <ParameterRow name="出块时间:">
          {{ data.block.timestamp | ms | dateformat('YYYY-MM-DD HH:mm:ss') }}
        </ParameterRow>
        <ParameterRow name="出块节点:" :value="data.block.creator" />
        <ParameterRow name="区块 hash:" :value="data.block.hash" />
      </div>
      <div class="card" style="margin:10px 0">
        <el-tabs v-model="activeTab" style="margin-top:-5px">
          <el-tab-pane :label="`交易(${data.transactions.length})`" name="0">
            <div v-if="data.transactions.length">
              <el-row
                v-for="item in data.transactions"
                :key="item.hash"
                :gutter="20"
                class="tx-row layout-row align-center layout-wrap"
              >
                <el-col :xs="24" :sm="10" class="tx-row-lf-part">
                  <div class="method-name">{{ item.method }}</div>
                  <div class="text-ellipsis">
                    <router-link :to="`/tx/${item.hash}`">
                      {{ item.hash }}
                    </router-link>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="14">
                  <JsonTreeView :data="item" />
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="原始数据" name="1">
            <JsonTreeView :data="data" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </div>
</template>

<script>
import JsonTreeView from '@/components/JsonTreeView/JsonTreeView'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import ParameterRow from '@/components/ParameterRow'
import LeftIcon from 'vue-material-design-icons/ChevronLeft.vue'
import RightIcon from 'vue-material-design-icons/ChevronRight.vue'
import { getBlock } from '../common/chain-api.js'

export default {
  components: {
    JsonTreeView,
    PageBreadcrumb,
    ParameterRow,
    LeftIcon,
    RightIcon
  },
  data() {
    return {
      activeTab: '0',
      blockNumber: null,
      data: null
    }
  },
  mounted() {
    this.init()
  },
  beforeRouteUpdate(to, from, next) {
    next()
    this.init()
  },
  methods: {
    init() {
      let which = this.$route.params.which
      if (Number.parseInt(which).toString() === which) {
        which = Number.parseInt(which)
      }
      this.whichBlock = which
      this.fetchData()
    },
    async fetchData() {
      this.$_APP.loading = true
      try {
        this.data = await getBlock(this.whichBlock)
        this.blockNumber = this.data.block.number
      } catch (e) {
        console.error(e)
      } finally {
        this.$_APP.loading = false
      }
    },
    lastBlock() {
      const last = this.blockNumber - 1
      if (last === 0) return
      this.$router.push({
        name: 'Block',
        params: { which: last }
      })
    },
    nextBlock() {
      const next = this.blockNumber + 1
      this.$router.push({
        name: 'Block',
        params: { which: next }
      })
    }
  }
}
</script>
