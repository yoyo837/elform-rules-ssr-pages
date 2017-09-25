<template>
  <section class="container">
    <div ref="others">
      <el-row>
        <el-col :span="21">
          <Slider :data-list="serverData.itemDataList" idkey="itemId" label="itemIdValue" type="item" v-model="itemId"></Slider>
        </el-col>
        <el-col :span="3" class="text-center">
          <nuxt-link to="/user/my">
            <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/m_zh1.png`" class="user-icon">
          </nuxt-link>
        </el-col>
      </el-row>
      <Slider :data-list="serverData.dateDataList" idkey="day" label="dayName" label2="weekName" type="datetime" v-model="curDate"></Slider>
      <div class="marquee-box" v-if="flushData.marqueeText && flushData.marqueeText.trim().length">
        <div class="marquee" :style="{left: marqueeLeft + 'px'}">
          {{flushData.marqueeText}}
        </div>
      </div>
    </div>

    <ScheduleTable :params="{salesId, itemId, dateTime: curDate, itemType}" :max-height="tableMaxHeight" @dataReload="onDataReload"></ScheduleTable>

    <div class="fixed-bt" ref="operation">
      <el-row>
        <el-col :span="16">
          <div class="money">
            共计{{totalPrice || 0}}元
          </div>
        </el-col>
        <el-col :span="8">
          <div class="btn">下一步</div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import { throttle } from 'throttle-debounce'
import Vue from 'vue'
import utils from '../../../components/utils'
import Slider from '../../vue-features/components/Slider'
import ScheduleTable from '../../vue-features/components/ScheduleTable'
import { Row, Col } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: this.flushData.salesName || '预定'
    }
  },
  components: {
    Slider,
    ScheduleTable
  },
  mounted() {
    this.$http.get('/sportPlatform/querySalesItemList.do', {
      salesId: this.salesId
    }).then(data => {
      _.assign(this.serverData, {
        itemDataList: data || []
      })
    })
    if (process.browser) {
      window.addEventListener('resize', this.windowResizeListener)
    }
    this.mq()
  },
  methods: {
    windowResizeListener: throttle(50, function() {
      this.recalculateMaxHeight()
    }),
    recalculateMaxHeight() {
      // 40 表头
      this.tableMaxHeight = utils.screenSize().height - 40 - ['operation', 'others'].map(name => {
        return this.$refs[name]
      }).reduce((prev, current, i, list) => {
        return prev + Math.max(current.offsetHeight, current.clientHeight)
      }, 0) || 0
    },
    mq() {
      if (this.marquee) {
        if (this.marqueeLeft < -1500) {
          this.marqueeLeft = utils.screenSize().width + 30
        }
        this.marqueeLeft = this.marqueeLeft - 3
        setTimeout(this.mq, 30)
      }
    },
    onDataReload(flushData) {
      flushData = flushData || {}
      this.flushData = flushData

      this.recalculateMaxHeight()
    }
  },
  watch: {
    itemId(val, oldVal) {
      if (this.itemId) {
        const itemObj = this.serverData.itemDataList.find(item => {
          return item.itemId === this.itemId
        })
        this.itemType = itemObj.itemType

        this.$nextTick().then(() => {
          this.$http.get('/sportPlatform/queryCalendarList.do', {
            salesId: this.salesId,
            itemId: this.itemId
          }).then(data => {
            _.assign(this.serverData, {
              dateDataList: data || []
            })
          })
        })
      }
    },
    'flushData.marqueeText'() {
      this.marqueeLeft = 100
    }
  },
  data() {
    return {
      marquee: true,
      marqueeLeft: 100,
      tableMaxHeight: 0,
      totalPrice: 0,
      flushData: {}, // 表格反馈的数据
      serverData: {
        itemDataList: [],
        dateDataList: []
      },
      salesId: this.$route.params['id'],
      itemId: null,
      curDate: null,
      itemType: null
    }
  },
  beforeDestroy() {
    this.marquee = false
  },
  destroyed() {
    if (process.browser) {
      if (this.windowResizeListener) {
        window.removeEventListener('rezise', this.windowResizeListener)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .user-icon {
    width: 26px;
    margin-top: 7px;
  }

  .marquee-box {
    overflow: hidden;
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    color: white;
    background-color: #dc9811;
    margin: 0 3px 3px 3px;
    position: relative;
    .marquee {
      width: 1500px;
      position: absolute;
    }
  }

  .fixed-bt {
    z-index: 1;
    background-color: white;
    border-top: 1px solid #eee;
    padding: 0;
    .el-row {
      .el-col {
        color: #FF5E20;
        font-size: 14px;
        .money,
        .btn {
          padding: 15px 0;
        }
        .btn {
          background-color: #FF5E20;
          color: white;
        }
      }
    }
  }
}
</style>
