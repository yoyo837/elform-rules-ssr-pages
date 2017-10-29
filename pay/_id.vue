<template>
  <section class="container container-pd">

    <Card class="timeout-tips">
      <i class="el-icon-warning" aria-hidden="true"></i>
      <div class="tips-text">
        <div>订单已提交，请在{{waitTimeText}}内完成支付!</div>
        <div>剩余时间:
          <span>{{payTimeText}}</span> 后将取消订单!</div>
      </div>
    </Card>

    <Card title-text="优惠信息" class="coupon-info">
      <template slot="header-desc">
        <span class="select-coupon">请选择
          <i class="el-icon-arrow-right" aria-hidden="true"></i>
        </span>
      </template>
    </Card>

    <Card title-text="支付方式" class="pay-mode-list">
      <el-row v-if="amountAvail">
        <el-col :span="20">
          <img :src="`${CDN_STATIC_HOST}/${payModeIcons[5]}`"> 会员账户支付
          <span class="balance-desc">(余额{{(this.serverData.pubAccount || {}).amount || 0}}元)</span>
        </el-col>
        <el-col :span="4" class="text-right">
          <el-radio class="radio" v-model="form.payMeansId" :label="5" :disabled="!(canPay && canUseBalance)">&nbsp;</el-radio>
        </el-col>
      </el-row>
      <el-row v-for="(commonPayMean, i) in serverData.commonPayMeans" :key="commonPayMean.payMeansId" v-if="payModeIcons[commonPayMean.payMode]">
        <el-col :span="20">
          <img :src="`${CDN_STATIC_HOST}${payModeIcons[commonPayMean.payMode]}`"> {{commonPayMean.payMeansName}}
        </el-col>
        <el-col :span="4" class="text-right">
          <el-radio class="radio" v-model="form.payMeansId" :label="commonPayMean.payMeansId" :disabled="!canPay">&nbsp;</el-radio>
        </el-col>
      </el-row>
    </Card>

    <section class="fixed-bt">
      <el-row>
        <el-col :span="12" class="amount-wrapper">
          <el-button type="text" class="full-width">
            实付款：￥
            <span>{{priceText(totalPrice)}}</span>
          </el-button>
        </el-col>
        <el-col :span="12" class="pay-wrapper">
          <el-button type="text" class="primary-button full-width">确认支付</el-button>
        </el-col>
      </el-row>
    </section>

    <section class="open-browser-tips" v-show="showBrowserTips" @click="hideBrowserTip">
      <img v-if="isiOS" :src="`${CDN_STATIC_HOST}/themes/mobile/pay/ios.png`">
      <img v-else :src="`${CDN_STATIC_HOST}/themes/mobile/pay/android.png`">
    </section>

    <form ref="alipay-form" class="alipay-form" method="POST" :action="alipayForm.action">
      <input type="hidden" v-for="field in alipayForm.fields" :key="field.name" :name="field.name" :value="field.value">
    </form>

  </section>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import utils from '../../components/utils'
import popup from '../../components/popup'
import math from '../../components/math'
import { Row, Col, Button, Radio, Checkbox } from 'element-ui'
import Card from '../vue-features/components/Card'
import bdStyleMixin, { DefaultConfig } from '../vue-features/mixins/body-style'
// nuxt.config.js的externals配置似乎不可用
// import wx from 'jweixin'
// const wx = process.browser ? window.wx || {} : {}

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(Radio.name, Radio)
Vue.component(Checkbox.name, Checkbox)

export default {
  asyncData({ isClient }) {
    return {
      isClient
    }
  },
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: '支付'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    Card
  },
  mounted() {
    if (this.isClient) {
      // 微信SPA认证问题
      location.replace(location.href)
      return
    }
    this.$http
      .get('/pay/main.do', {
        dealId: this.dealId
      })
      .then(data => {
        if (process.browser) {
          this.mq()
        }
        data = data || {}
        data.dealInfo = data.dealInfo || {}
        data.dealInfo.commonPay = data.dealInfo.commonPay || {}

        // TEST
        // data.pubAccount = data.pubAccount || {}
        // data.pubAccount.amount = 0.5

        _.assign(this.serverData, data)

        this.$nextTick().then(() => {
          this.form.payMeansId = this.canUseBalance ? 5 : ((this.serverData.commonPayMeans || [])[0] || {}).payMeansId

          if (this.totalPrice <= 0 && this.form.pubServiceId == null) {
            // 没有服务之前价格为0
            this.toPay()
            return
          }

          this.canPay = true

          const dData = this.$route.query['_data']
          const _data = JSON.parse(dData === undefined ? null : dData)

          if (_data) {
            _.assign(this.form, _data.form)
            this.$nextTick().then(() => {
              this.toPay()
            })
          }
        })
      })
      .catch(e => {
        popup.alert(e.message, {
          callback: () => this.$router.push('/order')
        })
      })
  },
  methods: {
    // @click.prevent
    onPubServiceClick(event) {
      const dom = event.currentTarget
      const radio = this.$refs['pbs'].find(pbs => {
        return pbs.$el === dom
      })
      // console.log(radio.label, radio.value, this.form.pubServiceId)
      if (this.form.pubServiceId && radio.label === this.form.pubServiceId) {
        // 当前选中
        this.form.pubServiceId = null
      } else {
        this.form.pubServiceId = radio.label
      }
    },
    async initWXCode() {
      if (this.wxCode) {
        return true
      }
      const query = _.cloneDeep(this.$route.query)
      query['_data'] = {
        form: this.form
      }
      const arr = location.href.split('?')
      const result = await this.$http.get('/pay/getWechatCode.do', {
        redirectUrl: `${arr[0]}${Object.keys(query).length ? `?${utils.serialize(query)}` : ''}`
      })
      if (result) {
        location.replace(result)
        return false
      }
      return true
    },
    showBrowserTip() {
      // popup.alert('选择支付宝支付，请点击右上角[...]，选择浏览器打开')
      this.showBrowserTips = true
      utils.disableBodyScroll()
    },
    hideBrowserTip() {
      this.showBrowserTips = false
      utils.enableBodyScroll()
    },
    toCancel() {
      this.$http
        .post('/deal/cancel.do', {
          dealId: this.serverData.dealInfo.deal.id
        })
        .then(data => {
          this.$router.push('/order')
        })
    },
    toPay() {
      // if (this.payMode === 5 || this.totalPrice <= 0) {
      //   // 账户支付
      //   this.$http
      //     .post('/pay/pubAccountPay.do', {
      //       dealId: this.dealId,
      //       pubServiceAccountId: this.form.pubServiceId
      //     })
      //     .then(data => {
      //       this.$router.push(`/pay/result/${this.dealId}`)
      //     })
      //   return
      // }
      // if (this.payMode === 7) {
      //   // 微信支付
      //   if (utils.isWeiXin()) {
      //     // 在微信中
      //     this.$wxConfig(true).then(jsConfig => {
      //       jsConfig = jsConfig || {}
      //       wx.config({
      //         debug: false,
      //         appId: jsConfig.appId,
      //         timestamp: jsConfig.timestamp,
      //         nonceStr: jsConfig.nonStr,
      //         signature: jsConfig.signature,
      //         jsApiList: ['chooseWXPay']
      //       })

      //       wx.error(res => {
      //         popup.alert(res.errMsg)
      //       })

      //       wx.ready(() => {
      //         this.initWXCode().then(result => {
      //           if (result) {
      //             this.$http
      //               .post('/pay/wechatPay.do', {
      //                 dealId: this.dealId,
      //                 pubServiceAccountId: this.form.pubServiceId,
      //                 payMeansId: this.form.payMeansId,
      //                 redirectUrl: location.href.split('#')[0],
      //                 code: this.wxCode
      //               })
      //               .then(data => {
      //                 data = data || {}
      //                 wx.chooseWXPay({
      //                   appId: data.appId,
      //                   timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      //                   nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
      //                   package: data.pkg, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      //                   signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      //                   paySign: data.paySign, // 支付签名
      //                   success: res => {
      //                     // console.log(res)
      //                     this.$router.push(`/pay/result/${this.dealId}`) // 支付成功后的回调函数
      //                   }
      //                 })
      //               })
      //           }
      //         })
      //       })
      //     })
      //   } else {
      //     popup.alert('暂不支持在微信外使用微信支付，请在微信中打开或选择其他支付方式')
      //   }
      // } else if (this.payMode === 2) {
      //   // 支付宝
      //   if (utils.isWeiXin()) {
      //     // 在微信中
      //     this.showBrowserTip()
      //   } else {
      //     this.$http
      //       .post('/pay/zfbPay.do', {
      //         dealId: this.dealId,
      //         pubServiceAccountId: this.form.pubServiceId,
      //         payMeansId: this.form.payMeansId,
      //         returnUrl: `/pay/result/${this.dealId}`
      //       })
      //       .then(data => {
      //         data = data || {}
      //         _.assign(this.alipayForm, {
      //           action: data['action'],
      //           fields: Object.keys(data)
      //             .filter(key => {
      //               return key !== 'action'
      //             })
      //             .map(key => {
      //               return {
      //                 name: key,
      //                 value: data[key]
      //               }
      //             })
      //         })

      //         this.$nextTick().then(() => {
      //           this.$refs['alipay-form'].submit() // 跳转到支付宝
      //         })
      //       })
      //   }
      // } else {
      //   popup.alert('不支持的第三方支付方式')
      // }
    },
    mq() {
      // 刷新当前时间
      this.now = moment()
      if (this.timerSwitch) {
        setTimeout(this.mq, 1000 * 1)
      }
    },
    calTimeText(targetTime, nowTime = 0) {
      if (targetTime) {
        let left = targetTime - nowTime
        if (left > 0) {
          const str = []
          const days = Math.floor(left / (1000 * 60 * 60 * 24))
          left = left % (1000 * 60 * 60)
          const hours = Math.floor(left / (1000 * 60 * 60))
          left = left % (1000 * 60 * 60)
          const minutes = Math.floor(left / (1000 * 60))
          left = left % (1000 * 60)
          const secends = Math.floor(left / 1000)

          if (days) {
            str.push(days)
            str.push('天')
          }
          if (hours) {
            str.push(hours)
            str.push('时')
          }
          if (minutes) {
            str.push(minutes)
            str.push('分')
          }
          if (secends) {
            str.push(secends)
            str.push('秒')
          }
          return str.join('')
        }
      }
      return null
    },
    priceText(price = 0) {
      return math.div(price, 100)
    }
  },
  computed: {
    amountAvail() {
      return (this.serverData.pubAccount || {}).amount
    },
    canUseBalance() {
      return this.amount >= this.totalPrice
    },
    payMode() {
      return (
        ((this.serverData.commonPayMeans || []).find(item => {
          return item.payMeansId === this.form.payMeansId
        }) || {}
        ).payMode || this.form.payMeansId
      )
    },
    usePubService() {
      return this.couponPrice > 0 || this.deductionPrice > 0
    },
    /**
     * 优惠金额，这个是提示优惠内容
     */
    couponPrice() {
      if (this.couponInfo) {
        if (this.couponInfo.payServicePrice) {
          return this.couponInfo.payServicePrice.differencePrice || 0
        }
      }
      return 0
    },
    /**
     * 服务扣除，这个才是最终支付金额应该扣除的
     */
    deductionPrice() {
      if (this.couponInfo) {
        if (this.couponInfo.payServicePrice) {
          return this.couponInfo.payServicePrice.serviceAmountSubPrice || 0
        }
      }
      return 0
    },
    /**
     * 支付金额
     */
    totalPrice() {
      return Math.max((this.serverData.dealInfo.commonPay.payFeeTotal || 0) - this.deductionPrice, 0)
    },
    waitTimeText() {
      return this.calTimeText(this.serverData.payWaitTime)
    },
    payTimeText() {
      const time = +this.now.format('x')
      return this.calTimeText(this.serverData.payExpireTime, time)
    },
    item() {
      return this.serverData.dealInfo
    }
  },
  watch: {
    canUseBalance() {
      if (!this.canUseBalance) {
        this.form.payMeansId = null
      }
    },
    now() {
      if (this.serverData.payExpireTime) {
        const time = +this.now.format('x')
        if (this.timerSwitch && this.serverData.payExpireTime <= time) {
          this.timerSwitch = false
          popup.alert('订单已过支付有效期并自动取消，请重新下单', {
            callback: () => {
              this.$router.push('/order')
            }
          })
        }
      }
    },
    async 'form.pubServiceId'() {
      // console.log('当前', this.form.pubServiceId)
      if (this.couponCacheMap.has(this.form.pubServiceId)) {
        this.couponInfo = this.couponCacheMap.get(this.form.pubServiceId)
      } else {
        if (this.form.pubServiceId == null) {
          this.couponInfo = null
          return
        }
        await this.$http
          .get('/pay/calcPubServicePrice.do', {
            dealId: this.dealId,
            pubServiceAccountId: this.form.pubServiceId
          })
          .then(data => {
            data = data || {}
            this.couponCacheMap.set(this.form.pubServiceId, data)
            this.couponInfo = data
          })
      }
    }
  },
  data() {
    return {
      showBrowserTips: false,
      isiOS: utils.isiOS(),
      payModeIcons: {
        '2': '/themes/mobile/common/images/zf.png',
        '5': '/themes/mobile/common/images/vip.png',
        '7': '/themes/mobile/common/images/wx.png',
        '8': '/themes/mobile/common/images/fee.png'
      },
      form: {
        payMeansId: null,
        pubServiceId: null
      },
      alipayForm: {
        // 支付宝支付表单
        action: null,
        fields: []
      },
      serverData: {
        pubServiceAccountList: [],
        payWaitTime: 0,
        payExpireTime: 0,
        pubAccount: {},
        dealFeePrice: 0, // 如果大于0则只有积分支付
        dealPaidPrice: 0, // 订单总价
        dealTotalPrice: 0, // 实收总价
        dealInfo: {
          deal: {},
          commonPay: {}
        }
      },
      now: moment(),
      couponInfo: null, // 当前会员服务
      timerSwitch: true,
      couponCacheMap: new Map(), // 会员服务折扣信息
      canPay: false, // 可支付
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-pay`,
      dealId: this.$route.params['id'],
      wxCode: this.$route.query['code'],
      DealStatusMap: utils.DealStatusMap
    }
  },
  destroyed() {
    this.timerSwitch = false
  }
}
</script>

<style lang="scss">
body.bd-pt-pay {
  padding-bottom: 60px;
}
</style>

<style lang="scss" scoped>
.container {
  .timeout-tips {
    i {
      font-size: 28px;
      color: #f26a3e;
      margin-top: 6px;
    }
    .tips-text {
      height: 40px;
      width: calc(100% - 28px);
      display: inline-block;
      vertical-align: top;
      padding-left: 15px;
      div {
        line-height: 14px;
        padding: 3px 0;
        span {
          color: #f26a3e;
        }
      }
    }
  }

  .coupon-info {
    .select-coupon {
      color: #f26a3e;
      font-size: 12px;
      i {
        color: #d8d8d8;
        font-size: 12px;
        vertical-align: middle;
      }
    }
  }

  .pay-mode-list {
    img {
      height: 24px;
      width: auto;
      vertical-align: middle;
      margin-right: 5px;
    }
    .el-row {
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
      &:first-child {
        padding-top: 0;
      }
      &:last-child {
        padding-bottom: 0;
        border: none;
      }
    }
  }

  .fixed-bt {
    .amount-wrapper {
      width: calc(100% - 100px);
      .el-button {
        color: #222;
        font-size: 14px;
        font-weight: normal;
        text-align: left;
        span {
          font-size: 18px;
          color: #f26a3e;
          font-weight: bolder;
        }
      }
    }
    .pay-wrapper {
      width: 100px;
    }
  }

  .open-browser-tips {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    img {
      width: 100%;
    }
  }
  .alipay-form {
    display: none;
  }
}
</style>

