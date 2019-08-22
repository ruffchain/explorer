<template>
  <div class="loading-component">
    <div class="ball"></div>
    <div class="ball"></div>
    <div class="ball"></div>
    <div class="ball"></div>
  </div>
</template>

<style lang="scss" scoped>
.loading-component {
  width: 200px;
  margin: 0 auto;
  .ball {
    width: 90px;
    height: 10px;
    margin: 10px auto;
    border-radius: 50px;
  }
  .ball:nth-child(1) {
    background: #ff005d;
    animation: right 1s infinite ease-in-out;
  }

  .ball:nth-child(2) {
    background: #35ff99;
    animation: left 1.1s infinite ease-in-out;
  }

  .ball:nth-child(3) {
    background: #008597;
    animation: right 1.05s infinite ease-in-out;
  }

  .ball:nth-child(4) {
    background: #ff7c35;
    animation: left 1.15s infinite ease-in-out;
  }
}

@keyframes right {
  0% {
    transform: translate(-15px);
  }
  50% {
    transform: translate(15px);
  }
  100% {
    transform: translate(-15px);
  }
}

@keyframes left {
  0% {
    transform: translate(15px);
  }
  50% {
    transform: translate(-15px);
  }
  100% {
    transform: translate(15px);
  }
}
</style>
