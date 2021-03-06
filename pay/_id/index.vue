<template>
  <mt-tab-container v-model="activePage">
    <mt-tab-container-item id="payPage">
      <section class="container container-pd">
        <Card class="timeout-tips" v-if="canMqPayTimeout">
          <i class="el-icon-warning" aria-hidden="true"></i>
          <div class="tips-text">
            <div>订单已提交，请在{{waitTimeText}}内完成支付!</div>
            <div>剩余时间:
              <span>{{payTimeText}}</span> 后将取消订单!</div>
          </div>
        </Card>

        <Card title-text="订单信息">
          <OrderList :deal-info="item" :coupon-info="couponInfo"></OrderList>
          <el-row class="order-counter">
            <el-col :span="8">订单合计：</el-col>
            <el-col :span="16" class="text-right">
              <del v-if="usePubService">
                ￥{{formatMoney(originalPrice)}}
              </del>
              ￥{{formatMoney(totalPrice)}}
            </el-col>
          </el-row>
        </Card>

        <Card title-text="优惠信息" class="coupon-info" v-if="!userFee">
          <template slot="header-desc">
            <span class="select-coupon text-overflow" :title="couponText" @click="toSwitchCouponPage">
              {{couponText}}
            </span>
            <i class="el-icon-arrow-right" aria-hidden="true"></i>
          </template>
          <el-row class="order-counter-desc" v-if="usePubService">
            <el-col :span="24">
              优惠：
              <span>￥{{formatMoney(couponPrice)}}</span>; 服务抵扣：
              <span>￥{{formatMoney(deductionPrice)}}</span>;
            </el-col>
          </el-row>
        </Card>

        <Card title-text="支付方式" class="pay-mode-list">
          <el-row v-if="amountAvail">
            <el-col :span="20">
              <img :src="`${CDN_STATIC_HOST}/${payModeIcons[5]}`"> 会员账户支付
              <span class="balance-desc">(余额{{formatMoney(amount)}}元)</span>
            </el-col>
            <el-col :span="4" class="text-right">
              <el-radio class="radio" v-model="form.payMeansId" :label="5" :disabled="!(canPay && canUseBalance)">&nbsp;</el-radio>
            </el-col>
          </el-row>
          <el-row v-for="(commonPayMean, i) in serverData.commonPayMeans" :key="commonPayMean.payMeansId" v-if="payModeIcons[commonPayMean.payMode]">
            <el-col :span="20">
              <img :src="`${CDN_STATIC_HOST}${payModeIcons[commonPayMean.payMode]}`"> {{commonPayMean.payMeansName}}
              <span v-if="commonPayMean.payMode == 8" class="balance-desc">(剩余积分{{formatMoney(accountFee, 0)}}分)</span>
            </el-col>
            <el-col :span="4" class="text-right">
              <el-radio class="radio" v-model="form.payMeansId" :label="commonPayMean.payMeansId" :disabled="!canPay">&nbsp;</el-radio>
            </el-col>
          </el-row>
        </Card>

        <section class="open-browser-tips" v-show="showBrowserTips" @click="hideBrowserTip">
          <img v-if="isiOS" :src="`${CDN_STATIC_HOST}/themes/mobile/pay/ios.png`">
          <img v-else :src="`${CDN_STATIC_HOST}/themes/mobile/pay/android.png`">
        </section>

        <form ref="alipay-form" class="alipay-form" method="POST" :action="alipayForm.action">
          <input type="hidden" v-for="field in alipayForm.fields" :key="field.name" :name="field.name" :value="field.value">
        </form>

        <section class="fixed-bt">
          <el-row>
            <el-col :span="12" class="amount-wrapper">
              <template v-if="userFee">
                <el-button type="text" class="full-width">
                  积分支付：
                  <span>{{formatMoney(serverData.dealFeePrice, 0)}}分</span>
                </el-button>
              </template>
              <template v-else>
                <el-button type="text" class="full-width">
                  实付款：￥
                  <span>{{formatMoney(totalPrice)}}</span>
                </el-button>
              </template>
            </el-col>
            <el-col :span="12" class="pay-wrapper">
              <el-button type="text" class="primary-button full-width" @click="toPay">确认支付</el-button>
            </el-col>
          </el-row>
        </section>

      </section>
    </mt-tab-container-item>
    <mt-tab-container-item id="couponPage">
      <section class="container container-pd text-center">
        <Card v-if="serverData.pubServiceAccountList && serverData.pubServiceAccountList.length">
          <Stamp v-for="pubService in serverData.pubServiceAccountList" :data="pubService" :key="pubService.pubServiceAccountId" @click.native="onPubServiceClick(pubService)" :checkState="true">
          </Stamp>
        </Card>
        <Card v-else>
          <div class="empty-coupon text-center">暂无优惠</div>
        </Card>
      </section>
    </mt-tab-container-item>
  </mt-tab-container>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import utils from '../../../components/utils'
import popup from '../../../components/popup'
// import math from '../../../components/math'
import { Row, Col, Button, Radio } from 'element-ui'
import { TabContainer, TabContainerItem } from 'mint-ui'
import Card from '../../vue-features/components/Card'
import Stamp from '../../vue-features/components/Stamp'
import OrderList from '../../vue-features/components/OrderList'
import bdStyleMixin, { DefaultConfig } from '../../vue-features/mixins/body-style'
// nuxt.config.js的externals配置似乎不可用
// import wx from 'jweixin'
const wx = process.browser ? window.wx || {} : {}

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(Radio.name, Radio)

Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)

const prefix = '#active-'

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
    Card,
    Stamp,
    OrderList
  },
  mounted() {
    if (this.isClient) {
      // 微信SPA认证问题
      this.$router.go(0)
      return
    }

    this.setActivePageByHash()

    this.$http.get('/pay/main.do', {
      dealId: this.dealId
    }).then(data => {
      if (process.browser) {
        window.addEventListener('popstate', this.onPopstate)
      }
      data = data || {}
      data.dealInfo = data.dealInfo || {}
      data.dealInfo.deal = data.dealInfo.deal || {}

      // https://github.com/nuxt/nuxt.js/issues/1975
      data.dealInfo.commonSales = data.dealInfo.commonSales || {}

      // TEST
      // data.pubAccount = data.pubAccount || {}
      // data.pubAccount.amount = 50

      _.assign(this.serverData, data)
      this.form.pubServiceAccountId = this.serverData.pubServiceAccountId // 默认会员服务id

      this.$nextTick().then(() => {
        if (process.browser && this.canMqPayTimeout) {
          this.mq()
        }
        this.form.payMeansId = this.canUseBalance && !this.userFee ? 5 : ((this.serverData.commonPayMeans || [])[0] || {}).payMeansId

        if (this.payMode === 5 && this.totalPrice <= 0 && this.form.pubServiceAccountId == null) {
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
    }).catch(e => {
      popup.alert(e.message, {
        callback: () => this.$router.push('/order')
      })
    })
  },
  methods: {
    setActivePageByHash() {
      if (this.$route.hash.startsWith(prefix)) {
        const hashPage = this.$route.hash.substr(prefix.length)
        if (this.containerPages.includes(hashPage)) {
          this.activePage = hashPage
          return
        }
      }
      this.activePage = this.containerPages[0] // 因为默认0
    },
    onPopstate(popStateEvent) {
      this.setActivePageByHash()
    },
    toSwitchCouponPage() {
      this.toSwitchPage(1)
    },
    toSwitchPayPage() {
      this.toSwitchPage(0)
    },
    toSwitchPage(num) {
      if (num < 0 || num > this.containerPages.length - 1) {
        return
      }
      this.activePage = this.containerPages[num]
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      window.history.pushState({ activePage: this.activePage }, null, `${prefix}${this.activePage}`)
    },
    onPubServiceClick(pubService) {
      if (pubService.state === 0) {
        const pubServiceAccountId = pubService.pubServiceAccountId
        if (this.form.pubServiceAccountId === pubServiceAccountId) {
          this.form.pubServiceAccountId = null
        } else {
          this.form.pubServiceAccountId = pubServiceAccountId
        }
        this.toSwitchPayPage()
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
      this.$http.post('/deal/cancel.do', {
        dealId: this.serverData.dealInfo.deal.id
      }).then(data => {
        this.$router.push('/order')
      })
    },
    toPay() {
      if (this.payMode === 5 || this.payMode === 8 || this.totalPrice <= 0) {
        // 账户支付
        this.$http.post('/pay/pubAccountPay.do', {
          dealId: this.dealId,
          payMode: this.payMode,
          pubServiceAccountId: this.form.pubServiceAccountId
        }).then(data => {
          this.$router.push(`/pay/${this.dealId}/result`)
        })
        return
      }
      if (this.payMode === 7) {
        // 微信支付
        if (utils.isWeiXin()) {
          // 在微信中
          this.$wxConfig(true).then(jsConfig => {
            jsConfig = jsConfig || {}
            wx.config({
              debug: false,
              appId: jsConfig.appId,
              timestamp: jsConfig.timestamp,
              nonceStr: jsConfig.nonStr,
              signature: jsConfig.signature,
              jsApiList: ['chooseWXPay']
            })
            wx.error(res => {
              popup.alert(res.errMsg)
            })
            wx.ready(() => {
              this.initWXCode().then(result => {
                if (result) {
                  this.$http.post('/pay/wechatPay.do', {
                    dealId: this.dealId,
                    pubServiceAccountId: this.form.pubServiceAccountId,
                    payMeansId: this.form.payMeansId,
                    redirectUrl: location.href.split('#')[0],
                    code: this.wxCode
                  }).then(data => {
                    data = data || {}
                    wx.chooseWXPay({
                      appId: data.appId,
                      timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                      nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                      package: data.pkg, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                      signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                      paySign: data.paySign, // 支付签名
                      success: res => {
                        // console.log(res)
                        this.$router.push(`/pay/${this.dealId}/result`) // 支付成功后的回调函数
                      }
                    })
                  })
                }
              })
            })
          })
        } else {
          popup.alert('暂不支持在微信外使用微信支付，请在微信中打开或选择其他支付方式')
        }
      } else if (this.payMode === 2) {
        // 支付宝
        if (utils.isWeiXin()) {
          // 在微信中
          this.showBrowserTip()
        } else {
          this.$http.post('/pay/zfbPay.do', {
            dealId: this.dealId,
            pubServiceAccountId: this.form.pubServiceAccountId,
            payMeansId: this.form.payMeansId,
            returnUrl: `/pay/${this.dealId}/result`
          }).then(data => {
            data = data || {}
            _.assign(this.alipayForm, {
              action: data['action'],
              fields: Object.keys(data)
                .filter(key => {
                  return key !== 'action'
                })
                .map(key => {
                  return {
                    name: key,
                    value: data[key]
                  }
                })
            })
            this.$nextTick().then(() => {
              this.$refs['alipay-form'].submit() // 跳转到支付宝
            })
          })
        }
      } else {
        popup.alert('不支持的第三方支付方式')
      }
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
    }
  },
  computed: {
    canMqPayTimeout() {
      return this.serverData.payExpireTime >= 0
    },
    accountFee() {
      return (this.serverData.pubAccount || {}).accountFee
    },
    amount() {
      return (this.serverData.pubAccount || {}).amount
    },
    amountAvail() {
      return !this.userFee && this.amount > 0
    },
    canUseBalance() {
      return !this.userFee && this.amount >= this.totalPrice
    },
    payMode() {
      return (
        ((this.serverData.commonPayMeans || []).find(item => {
          return item.payMeansId === this.form.payMeansId
        }) || {}
        ).payMode || this.form.payMeansId
      )
    },
    userFee() {
      return this.serverData.dealFeePrice > 0
    },
    usePubService() {
      return this.couponPrice > 0 || this.deductionPrice > 0
    },
    originalPrice() {
      if (this.usePubService) {
        return this.couponInfo.payServicePrice.originalPrice || 0
      }
      return 0
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
    couponText() {
      if (this.couponInfo && this.form.pubServiceAccountId) {
        return ((this.serverData.pubServiceAccountList || []).find(item => {
          return item.pubServiceAccountId === this.form.pubServiceAccountId
        }) || {}
        ).serviceName
      }
      return '请选择'
    },
    /**
     * 服务扣除
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
      if (this.couponInfo) {
        if (this.couponInfo.payServicePrice) {
          return Math.max(this.couponInfo.payServicePrice.preferentialPrice || 0, 0)
        }
      }
      return Math.max(this.serverData.dealTotalPrice || 0, 0)
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
      if (this.canMqPayTimeout) {
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
    async 'form.pubServiceAccountId'() {
      if (this.couponCacheMap.has(this.form.pubServiceAccountId)) {
        this.couponInfo = this.couponCacheMap.get(this.form.pubServiceAccountId)
      } else {
        if (this.form.pubServiceAccountId == null) {
          this.couponInfo = null
          return
        }
        await this.$http.get('/pay/calcPubServicePrice.do', {
          dealId: this.dealId,
          pubServiceAccountId: this.form.pubServiceAccountId
        }).then(data => {
          data = data || {}
          this.couponCacheMap.set(this.form.pubServiceAccountId, data)
          this.couponInfo = data
        })
      }
    }
  },
  data() {
    const containerPages = ['payPage', 'couponPage']
    return {
      containerPages,
      activePage: containerPages[0],
      // activePage: 'couponPage',
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
        pubServiceAccountId: null
      },
      alipayForm: {
        // 支付宝支付表单
        action: null,
        fields: []
      },
      serverData: {
        pubServiceAccountList: [],
        payWaitTime: 0,
        payExpireTime: -1,
        pubAccount: {},
        dealFeePrice: 0, // 如果大于0则只有积分支付
        dealTotalPrice: 0, // 实收总价
        dealInfo: {
          deal: {}
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
    if (process.browser) {
      if (this.onPopstate) {
        window.removeEventListener('popstate', this.onPopstate)
      }
    }
  }
}
</script>

<style lang="scss">
body.bd-pt-pay {
  padding-bottom: 60px;
}
</style>

<style lang="scss" scoped>
del {
  color: #666;
  font-size: 12px;
}

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

  .order-counter {
    border-top: 1px solid #f0f0f0;
    padding-top: 15px;
    margin-top: 15px;
    .el-col {
      &:last-child {
        color: #f26a3e;
      }
    }
  }

  .order-counter-desc {
    padding-top: 5px;
    text-align: right;
    span {
      color: #f26a3e;
    }
  }

  .coupon-info {
    .select-coupon {
      color: #f26a3e;
      font-size: 12px;
      max-width: 150px;
      vertical-align: middle;
      padding: 0;
    }
    i {
      color: #d8d8d8;
      font-size: 12px;
      vertical-align: middle;
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

  .empty-coupon {
    color: #999;
    font-size: 12px;
    padding: 15px 0;
  }
}
</style>

