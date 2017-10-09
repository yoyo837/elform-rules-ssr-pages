<template>
  <section class="container">
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
          <el-button v-for="(dateTime, i) in ((serverData.platformList || [])[current.salesIndex] || {}).dateTimeList" :key="dateTime.scheduleId" :type="current.dateTimeIndex == i ? 'primary' : 'default'" @click="current.dateTimeIndex = i">{{dateTime.scheduleTime}}</el-button>
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
      title: '购票'
    }
  },
  mixins: [bdStyleMixin],
  mounted() {
    this.heartbeatAndCheck().then(data => {
      // if (data)
      console.log(data)
    })
    this.$http.get('/ticket/queryScheduleInfo.do', {
      dataId: this.dataid
    }).then(data => {
      _.assign(this.serverData, {
        platformList: data
      })
      this.mountedHasError = false
    }).catch(() => {
      // this.$router.go(-1)
      this.mountedHasError = true
    })
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
    async heartbeatAndCheck() {
      const result = await this.$http.get('/ticket/queue.do', {
        dataId: this.dataid
      })
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
        platformList: []
        // platformList: [{
        //   dateTimeList: [{
        //     priceList: [{}]
        //   }]
        // }]
      },
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-ticket-list`,
      num: 1,
      dataid: this.$route.query['id']
    }
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