<style lang="scss" scoped>
.page-breadcrumb {
  margin: 15px 0;
}
</style>

<template>
  <el-breadcrumb class="page-breadcrumb" separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">{{strHomePage}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  props: {
    title: {},
  },
  computed: {
    strHomePage() {
      return this.$t('PageBreadcrumb.homePage')
    },
  },
}
</script>
