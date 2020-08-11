<style lang="scss" scoped>
.app-dialog__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
  background: rgba($color: #000, $alpha: 0.1);
  overflow: auto;
}

.app-dialog {
  margin: 150px auto;
  width: 500px;
  position: relative;
  padding: 0 15px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.1);
}

.app-dialog__header {
  text-align: center;
  font-size: 18px;
  font-weight: bolder;
  padding: 20px;
}
.app-dialog__body {
  padding-right: 30px;
}

.app-dialog__footer {
  padding-bottom: 15px;
  display: flex;
  justify-content: flex-end;
}
.load-container {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  .container {
    width: 50px;
    height: 60px;
    text-align: center;
    font-size: 10px;
    .boxLoading {
      background-color: #00adb5;
      height: 100%;
      width: 6px;
      display: inline-block;
      margin-left: 4px;
      -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
      animation: stretchdelay 1.2s infinite ease-in-out;
    }
    .boxLoading2 {
      -webkit-animation-delay: -1.1s;
      animation-delay: -1.1s;
    }
    .boxLoading3 {
      -webkit-animation-delay: -1s;
      animation-delay: -1s;
    }
    .boxLoading4 {
      -webkit-animation-delay: -0.9s;
      animation-delay: -0.9s;
    }
    .boxLoading5 {
      -webkit-animation-delay: -0.8s;
      animation-delay: -0.8s;
    }
  }
}

@-webkit-keyframes stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}
@keyframes stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}
</style>

<template>
  <div class="app-dialog__wrapper">
    <div class="app-dialog">
      <div class="app-dialog__header">{{ title }}</div>
      <div class="app-dialog__body">
        <slot></slot>
        <span
          class="app-dialog__body-title"
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;交易进行中,但是在短时间内还没获取到交易成功执行的信息，稍后可自行确认交易是否被链执行。</span>
        <div class="load-container">
          <div class="container">
            <div class="boxLoading boxLoading1"></div>
            <div class="boxLoading boxLoading2"></div>
            <div class="boxLoading boxLoading3"></div>
            <div class="boxLoading boxLoading4"></div>
            <div class="boxLoading boxLoading5"></div>
          </div>
        </div>
      </div>
      <div class="app-dialog__footer">
        <el-button @click="closeDialog">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' },
  },
  methods: {
    closeDialog() {
      this.$confirm(
        '关闭后交易依旧进行中,稍后可自行确认交易是否被链执行?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        this.$emit('cleanForm')
      })
    },
  },
}
</script>

