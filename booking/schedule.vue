<template lang="pug">
  section.container
    el-row
      el-col(:span="21")
        Slider(:data-list="itemDataList")
      el-col(:span="3", class="text-center")
        nuxt-link(to="/user/my")
          img(:src="`${CDN_STATIC_HOST}/themes/mobile/common/images/m_zh1.png`", class="user-icon")
    Slider(:data-list="dateDataList")
    .marquee-box(v-if="marqueeText && marqueeText.trim().length")
      .marquee(:style="{left: marqueeLeft + 'px'}") {{marqueeText}}
</template>

<script>
import Vue from 'vue'
import { Row, Col } from 'element-ui'
import utils from '../../components/utils'
import Slider from '../vue-features/components/Slider'
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)

export default {
  components: {
    Slider
  },
  mounted() {
    this.mq()
  },
  beforeDestroy() {
    this.marquee = false
  },
  methods: {
    mq() {
      if (this.marquee) {
        if (this.marqueeLeft < -1500) {
          this.marqueeLeft = utils.screenSize().width + 30
        }
        this.marqueeLeft = this.marqueeLeft - 3
        setTimeout(this.mq, 30)
      }
    }
  },
  data() {
    return {
      marquee: true,
      marqueeLeft: 100,
      marqueeText: '巴拉巴宝莉第三方士大夫第三方士大夫士大夫第三方第三方第三方多少巴拉巴宝莉第三方士大夫第三方士大夫士大夫第三方第三方第三方多少',
      itemDataList: [{
        id: 1,
        name: '足球1'
      }, {
        id: 2,
        name: '足球2'
      }, {
        id: 3,
        name: '足球3'
      }, {
        id: 4,
        name: '足球4'
      }, {
        id: 5,
        name: '足球5'
      }, {
        id: 6,
        name: '足球6'
      }],
      dateDataList: [{
        id: 1,
        name: '2017-08-12 星期日'
      }, {
        id: 2,
        name: '2017-08-12 星期日'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.user-icon {
  width: 26px;
  margin-top: 7px;
}

.marquee-box {
  overflow: hidden;
  height: 40px;
  line-height: 40px;
  color: white;
  background-color: #dc9811;
  margin: 0 15px;
  .marquee {
    width: 1500px;
    position: absolute;
  }
}
</style>
