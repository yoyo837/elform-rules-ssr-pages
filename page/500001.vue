<template>
  <section class="container">
    <div class="page-title">
      <img :src="`${CDN_STATIC_HOST}/themes/mobile/red/red1/images/icon/icong-15.png`"> 我要订场
      <span>免费开发日历</span>
    </div>
    <div class="introduction">
      {{123}}
    </div>
  </section>
</template>

<script>
import pageConfig from '../vue-features/page-config'
export default {
  mounted() {
    pageConfig.getPageData([{
      mapId: 102103
    }, {
      mapId: 101985
    }, {
      mapId: 101986
    }]).then(data => {
      console.log(data)
    })
  },
  data() {
    return {
      serverData: {}
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .page-title {
    background-color: #f6f6f6;
    color: #FF5E20;
    font-size: 15px;
    padding: 8px;
    img {
      width: 18px;
      height: auto;
      vertical-align: bottom;
    }
    span {
      float: right;
      padding: 2px;
      font-size: 12px;
      border: 1px solid #FF5E20;
      border-radius: 15px;
    }
  }
}
</style>
