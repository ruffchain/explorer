<style scoped lang="scss">
.app-footer {
  margin-top: 20px;
  padding-top: 10px;
  padding-left: 50px;
  padding-right: 50px;
  padding-bottom: 20px;
  background: rgb(58, 78, 103);
  color: #fff;
  font-size: 13px;
  display: block;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .divider {
    display: none;
  }
  @media (min-width: 768px) {
    & {
      flex-direction: row;
      .divider {
        display: initial;
      }
    }
  }
  a {
    color: #fff;
    text-decoration: underline;
  }
  span{
    display: block;
    padding:5px,10px, 5px;

  }
}
</style>

<template>
  <div class="app-footer">
    <section>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12">
          Copyright ©2019 RUFF FOUNDATION LTD. All Rights Reserved
        </el-col>
        <el-col :xs="24" :sm="12">
          <!-- <span class="divider">|</span> -->
          <div>
            <span>
              <a
                target="_blank"
                href="https://github.com/ruffchain/Guide/wiki"
                >{{ strHelpCenter }}</a
              >
            </span>
            <span> </span>
            <span>
              <a
                target="_blank"
                href="https://ruffchain.com/plan-early-birds/profit/"
                >{{ strEarlyBird }}</a
              >
            </span>
          </div>
        </el-col>
      </el-row>
    </section>
  </div>
</template>
<script>
export default {
  computed: {
    strHelpCenter() {
      return this.$t('AppFooter.helpCenter')
    },
    strEarlyBird() {
      return this.$t('AppFooter.earlyBird')
    }
  }
}
</script>
