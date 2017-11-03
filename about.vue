<template>
  <section class="container container-pd">
    <Card title-text="关于我们" title-icon="icon-pt-about">
      <section class="about-info">
        <div class="about-info-item">
          <div class="about-title">
            技术支持:
          </div>
          <div class="about-content">
            深圳运动帝图科技有限公司
          </div>
        </div>
        <div class="about-info-item">
          <div class="about-title">
            服务网址:
          </div>
          <div class="about-content">
            <a href="http://www.ydmap.com.cn">www.ydmap.com.cn</a>
          </div>
        </div>
        <div class="about-info-item">
          <div class="about-title">
            服务电话:
          </div>
          <div class="about-content">
            <a href="tel:0755-83130059">0755-83130059</a>
          </div>
        </div>
        <div class="about-info-item">
          <div class="about-title">
            商务合作:
          </div>
          <div class="about-content">
            <a href="mailto:union@ydmap.com.cn">union@ydmap.com.cn</a>
          </div>
        </div>
      </section>
    </Card>
  </section>
</template>

<script>
import Vue from 'vue'
import { Row, Col } from 'element-ui'
import Card from './vue-features/components/Card'
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)

export default {
  name: 'aboutUs',
  head() {
    return {
      title: '关于我们'
    }
  },
  components: {
    Card
  }
}
</script>

<style lang="scss" scoped>
.about-info {
  padding: 15px 30px;
  .about-info-item {
    .about-title,.about-content {
      padding: 2px 0;
    }
    .about-title {
      font-size: 12px;
      color: #999;
    }
    .about-content {
      a {
        color: #666;
      }
    }
  }
  .about-info-item+.about-info-item{
    margin-top: 15px;
  }
}
</style>
