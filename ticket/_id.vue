<template>
  <section class="container">
    <template v-if="accessible">
      <div class="gap"></div>
      <div class="sec">
        <div class="sec-title">选择场馆</div>
        <ul class="sec-content">
          <li>
            <el-button v-for="(platform, i) in serverData.platformList" :key="platform.salesId" :type="current.salesIndex == i ? 'primary' : 'default'" @click="current.salesIndex = i">{{platform.salesName}}</el-button>
          </li>
        </ul>
      </div>
      <div class="sec">
        <div class="sec-title">选择场次时间</div>
        <ul class="sec-content">
          <li>
            <el-button v-for="(dateTime, i) in ((serverData.platformList || [])[current.salesIndex] || {}).dateTimeList" :key="dateTime.scheduleId" :type="current.dateTimeIndex == i ? 'primary' : 'default'" @click="current.dateTimeIndex = i">
              {{dateTime.scheduleTime}}
              <div class="datatime-descr" v-if="dateTime.descr">{{dateTime.descr}}</div>
            </el-button>
          </li>
        </ul>
      </div>
      <div class="sec">
        <div class="sec-title">选择价格</div>
        <ul class="sec-content">
          <li>
            <template v-for="(price, i) in ((((serverData.platformList || [])[current.salesIndex] || {}).dateTimeList || [])[current.dateTimeIndex] || {}).priceList">
              <div v-if="price.fee > 0 || (price.marketPrice == 0 && price.subPrice == 0)" :key="price.scheduleDetailId" class="el-button" :class="{'el-button--primary': current.priceIndex == i, 'coupon-box-vertical': true}" @click="current.priceIndex = i">
                <div class="coupon coupon-top" :class="{'coupon-vertical-merge': !(price.fee || price.descr)}">
                  {{price.fee || price.price || '免费'}}
                </div>
                <div class="coupon coupon-bottom">
                  {{price.fee ? '积分兑换' : price.descr}}
                </div>
              </div class="coupon">
              <div v-else :key="price.scheduleDetailId" class="el-button" :class="{'el-button--primary': current.priceIndex == i, 'coupon-box-horizontal': true}" @click="current.priceIndex = i">
                <div class="coupon coupon-left">
                  <div class="market-price">市场票价{{price.marketPrice}}</div>
                  <div class="sub-price">优惠{{price.subPrice}}</div>
                </div>
                <div class="coupon coupon-right">
                  <div :class="{'coupon-vertical-merge': !price.descr}">{{price.price > 0 ? price.price : '免费'}}</div>
                  <div>{{price.descr}}</div>
                </div>
              </div>
            </template>
          </li>
        </ul>
      </div>
      <div class="sec">
        <div class="sec-content num-content">
          数量
          <el-input-number size="small" v-model="num" :min="1" :max="max" :disabled="mountedHasError || priceInfo == null"></el-input-number>
          限购{{priceInfo == null ? 0 : priceInfo.maxBuyNum}}张 (剩余
          <span>{{priceInfo == null ? 0 : priceInfo.surplusNum}}</span>
          张)
        </div>
      </div>

      <div class="fixed-bt" v-if="!mountedHasError">
        <el-row>
          <el-col :span="12">
            <div class="money">
              共计{{totalPrice}}元
            </div>
          </el-col>
          <el-col :span="12">
            <div class="btn" @click="toSave">去支付</div>
          </el-col>
        </el-row>
      </div>
    </template>
    <template v-else>
      <div class="queue-box ctx-bg">
        <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/queues.gif`">
        <div class="queue-tips text-center">
          前面人太多，正在排队中...(您前面还有
          <span>{{queueResult || 0}}人</span>)
          <div class="queue-desc">
            排队结束将自动进入，无需刷新页面
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import math from '../../components/math'
import popup from '../../components/popup'
import { Row, Col, Button, InputNumber } from 'element-ui'
import bdStyleMixin, { DefaultConfig } from '../vue-features/mixins/body-style'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(InputNumber.name, InputNumber)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: this.serverData.ticketName || '购票'
    }
  },
  mixins: [bdStyleMixin],
  mounted() {
    this.hbc(true)
  },
  computed: {
    priceInfo() {
      return (((((this.serverData.platformList || [])[this.current.salesIndex] || {}).dateTimeList || [])[this.current.dateTimeIndex] || {}).priceList || [])[this.current.priceIndex]
    },
    totalPrice() {
      return math.mul(this.num, this.priceInfo == null ? 0 : this.priceInfo.price)
    },
    max() {
      return this.priceInfo == null ? 0 : Math.min(this.priceInfo.maxBuyNum, this.priceInfo.surplusNum)
    }
  },
  watch: {
    priceInfo(val, oldVal) {
      if (this.max === 0) {
        this.num = 0
      }
      if (this.num > this.max) {
        this.num = 1
      }
    }
  },
  methods: {
    hbc(isFirst) {
      this.heartbeatAndCheck(isFirst).then(data => {
        this.queueResult = data
        switch (data) {
          case -1: // 没有队列
          case 0: // 允许进入队列
            this.toLoadSchedule()
            this.accessible = true
            break
          default: // 需要排队
            this.accessible = false
            break
        }
        if (this.queueSwitch && data >= 0) {
          setTimeout(this.hbc, 1000 * 3)
        }
      })
    },
    async toLoadSchedule() {
      if (this.hasLoaded) {
        return
      }
      this.hasLoaded = true
      await this.$http.get('/ticket/queryScheduleInfo.do', {
        dataId: this.dataid
      }).then(data => {
        data = data || {}
        _.assign(this.serverData, {
          platformList: data.commonScheduleInfoList || [],
          ticketName: data.ticketName
        })
        this.mountedHasError = false
      }).catch(() => {
        // this.$router.go(-1)
        this.mountedHasError = true
      })
    },
    async heartbeatAndCheck(isFirst) {
      const result = await this.$http.get('/ticket/queue.do', {
        dataId: this.dataid
      }, { silent: !isFirst })
      return result
    },
    toSave() {
      if (this.inSaveProcessing) {
        popup.alert('请等待上一次操作完成...')
        return
      }
      this.$http.post('/ticket/save.do', {
        scheduleDetailId: this.priceInfo.scheduleDetailId,
        num: this.num
      }).then(data => {
        this.$router.push(`/pay/${data}`)
        this.inSaveProcessing = false
      }).catch(e => {
        this.inSaveProcessing = false
      })
    }
  },
  data() {
    return {
      inSaveProcessing: false,
      mountedHasError: true,
      current: {
        salesIndex: 0,
        dateTimeIndex: 0,
        priceIndex: 0
      },
      serverData: {
        platformList: [],
        ticketName: null
        // platformList: [{
        //   dateTimeList: [{
        //     priceList: [{}]
        //   }]
        // }]
      },
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-ticket-list`,
      num: 1,
      dataid: this.$route.params['id'],
      hasLoaded: false,
      queueSwitch: true,
      accessible: true,
      queueResult: null
    }
  },
  destroyed() {
    this.queueSwitch = false
  }
}
</script>

<style lang="scss">
body.bd-pt-ticket-list {
  padding-bottom: 60px;
}
</style>


<style lang="scss" scoped>
$padding: 10px;
.container {
  .queue-box {
    width: 100%;
    height: 100%;
    padding: 10px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    img {
      width: 100%;
    }
    .queue-tips {
      padding: 25px 0;
      font-size: 14px;
      span {
        color: #f52;
        font-size: 12px;
      }
      .queue-desc {
        color: #999;
        font-size: 12px;
        padding: 10px 0;
      }
    }
  }
  .gap {
    height: 15px;
    background-color: white;
  }
  .sec {
    .sec-title {
      color: #777;
      font-size: 14px;
      height: 26px;
      line-height: 26px;
      padding: 0 $padding;
    }
    .sec-content {
      margin: 0;
      padding: $padding;
      list-style-type: none;
      background-color: white;
      .el-button+.el-button {
        margin-left: 0;
      }
      .el-button {
        margin: 5px 10px 5px 0;
        .datatime-descr {
          font-size: 12px;
          line-height: 14px;
        }
      }
      $finallySize: 18px;
      .coupon-box-horizontal {
        padding: 0;
        .coupon {
          display: inline-block;
        } // .coupon-left,
        // .coupon-right {
        //   height: 100%;
        // }
        .coupon-left {
          padding: 10px 7.5px 10px 15px;
          .market-price {}
          .sub-price {}
        }
        .coupon-right {
          padding: 10px 5px;

          >* {
            &:first-child {
              font-size: $finallySize;
            }
          }
        }
      }
      .coupon-box-vertical {
        .coupon-top {
          font-size: $finallySize;
        }
      }
      .coupon-vertical-merge {
        display: inline-block;
        line-height: 32px;
        vertical-align: bottom;
      }
    }
    .num-content {
      border-top: 1px solid #eee;
      font-size: 14px;
      .el-input-number {
        margin: 0 5px;
      }
      .el-input-number+span {
        color: #FF5E20;
      }
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
