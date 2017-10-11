<template>
  <section class="container">
    <div class="main-box">
      <el-row>
        <template v-if="payTimeText">
          <el-col :span="24" v-show="false"></el-col>
          <el-col :span="24" class="ctx-bg auto-cancel-tip">
            <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/pay_lock.png`">您的订单已提交，请在
            <span class="how-long">{{waitTimeText}}</span>内完成支付，
            <span class="when-time">{{payTimeText}}</span>后将自动取消订单
            <el-button type="danger" size="mini" @click="toCancel">立即取消</el-button>
          </el-col>
        </template>
        <el-col :span="24">
          <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/deal_s.png`">
          <span>订单信息</span>
        </el-col>
        <el-col :span="24" class="ctx-bg">
          <!-- 订场 -->
          <div class="pay-item" v-for="dealPlatform in serverData.dealInfo.dealPlatformList" :key="dealPlatform.id">
            <el-row>
              <el-col :span="6">场地：</el-col>
              <el-col :span="12">{{dealPlatform.orderDateValue}} {{dealPlatform.startTimeValue}}-{{dealPlatform.endTimeValue}} {{dealPlatform.platformParentName}}{{dealPlatform.platformName}}</el-col>
              <!-- <el-col :span="24" class="text-right" v-if="dealPlatform.isFightDeal">约战</el-col> -->
              <el-col :span="6" class="text-right">
                <span class="price">{{dealPlatform.transactionPriceValue}}</span>
              </el-col>
            </el-row>
          </div>
          <!-- 服务人员 -->
          <div class="pay-item" v-for="dealServiceUser in serverData.dealInfo.dealServiceUserList" :key="dealServiceUser.id">
            <el-row>
              <el-col :span="6">教练：</el-col>
              <el-col :span="12">{{dealServiceUser.orderDateValue}} {{dealServiceUser.startTimeValue}}-{{dealServiceUser.endTimeValue}} {{dealServiceUser.realName}}</el-col>
              <!-- <el-col :span="24" class="text-right" v-if="dealServiceUser.isFight">约战付一半</el-col> -->
              <el-col :span="6" class="text-right">
                <span class="price">{{dealServiceUser.transactionPriceValue}}</span>
              </el-col>
            </el-row>
          </div>
          <!-- 商品 -->
          <div class="pay-item" v-for="(dealItemList, i) in serverData.dealInfo.dealItemList" :key="i">
            <template v-for="dealItemSnap in dealItemList">
              <el-row :key="dealItemSnap.id">
                <el-col :span="6">商品：</el-col>
                <el-col :span="12">{{dealItemSnap.itemName}} {{dealItemSnap.attrOptionValue1}} {{dealItemSnap.attrOptionValue2}}/{{dealItemSnap.itemNum}}{{dealItemSnap.itemUnit}}</el-col>
                <el-col :span="6" class="text-right">
                  <span class="price">{{dealItemSnap.transactionTotalPriceValue}}</span>
                </el-col>
              </el-row>
            </template>
          </div>
          <!-- 报名 -->
          <div class="pay-item" v-for="dealSignup in serverData.dealInfo.dealSignupList" :key="dealSignup.id">
            <el-row>
              <el-col :span="6">报名：</el-col>
              <el-col :span="12">{{dealSignup.exerciseList.exerciseName}}</el-col>
              <el-col :span="6" class="text-right">
                <span class="price">{{dealSignup.transactionPriceValue}}</span>
              </el-col>
            </el-row>
          </div>
          <!-- 票务 -->
          <div class="pay-item" v-for="dealTicket in serverData.dealInfo.dealTicketList" :key="dealTicket.id">
            <el-row>
              <el-col :span="6">票名/数量: </el-col>
              <el-col :span="18">{{dealTicket.platformParentName}} {{dealTicket.ticketName}}/{{dealTicket.salesNum}}张</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">地址: </el-col>
              <el-col :span="18">{{dealTicket.salesName}}</el-col>
            </el-row>
            <el-row v-if="dealTicket.platformMapId">
              <el-col :span="6">座位号：</el-col>
              <el-col :span="18">{{dealTicket.platformMapName}}</el-col>
            </el-row>
            <el-row v-if="dealTicket.orderDate">
              <el-col :span="6">开始时间：</el-col>
              <el-col :span="18">{{dealTicket.orderDateValue}} {{dealTicket.startTimeValue}}</el-col>
            </el-row>
            <el-row v-else>
              <el-col :span="6">有效期：</el-col>
              <el-col :span="18">{{dealTicket.fromDateValue}}至{{dealTicket.toDateValue}}</el-col>
            </el-row>
          </div>
          <!-- 服务 -->
          <div class="pay-item" v-for="dealServicePub in serverData.dealInfo.dealServicePubList" :key="dealServicePub.id">
            <el-row>
              <el-col :span="6">服务名称：</el-col>
              <el-col :span="12">{{dealServicePub.serviceName}}</el-col>
              <el-col :span="6" class="text-right">{{dealServicePub.transactionTotalPriceValue}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">数量：</el-col>
              <el-col :span="18">{{dealServicePub.buyNum}}张</el-col>
            </el-row>
          </div>
          <div class="pay-info">
            <el-row>
              <el-col :span="8">订单总金额：</el-col>
              <el-col :span="16" class="text-right">
                <span class="price">{{serverData.dealInfo.commonPay.payFeeTotalValue}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">需支付金额：</el-col>
              <el-col :span="16" class="text-right">
                <span class="price">{{priceText(totalPrice)}}</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/fw_style.png`">
          <span>优惠服务</span>
        </el-col>
        <el-col :span="24" class="ctx-bg">
          <template v-if="serverData.pubServiceAccount && serverData.pubServiceAccount.length">
            <div v-for="item in serverData.pubServiceAccount" :key="item.id" class="stamp">
              <el-row>
                <el-col :span="20">
                  <div class="description">
                    <span class="desc-avail">可用</span>
                    <span class="desc-name">{{item.serviceName}}</span>
                  </div>
                  <div class="description">
                    <span class="desc-desc">服务储值金额：{{0}}元</span>
                  </div>
                  <div class="description">
                    <span class="desc-enjoy">享有</span>
                    <span class="desc-desc">{{item.dataContent}}</span>
                  </div>
                  <div class="description">
                    <span class="desc-desc">有效期：{{item.startDateValue}}至{{item.endDateValue}}</span>
                  </div>
                </el-col>
                <el-col :span="4" class="text-right">
                  <span @click.prevent="onPubServiceClick($event)">
                    <el-radio class="radio" v-model="form.pubServiceId" :label="item.id" :disabled="!canPay" ref="pbs">&nbsp;</el-radio>
                  </span>
                </el-col>
              </el-row>
            </div>
          </template>
          <template v-else>
            您暂无可用会员优惠服务,请先购买优惠服务!
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/zf_style.png`">
          <span>支付方式</span>
        </el-col>
        <el-col :span="24" class="ctx-bg">
          <div class="pay-mode" v-if="amountAvail">
            <el-row>
              <el-col :span="18">
                <img :src="`${CDN_STATIC_HOST}/${payModeIcons[5]}`"> 会员账户支付
                <span class="balance-desc">(余额{{(this.serverData.publicAccount || {}).amountAvailValue || 0}}元)</span>
              </el-col>
              <el-col :span="6" class="text-right">
                <el-radio class="radio" v-model="form.payMeansId" :label="5" :disabled="!(canPay && canUseBalance)">&nbsp;</el-radio>
              </el-col>
            </el-row>
          </div>
          <div class="pay-mode" v-for="(commonPayMean, i) in serverData.commonPayMeans" :key="commonPayMean.payMeansId" v-if="payModeIcons[commonPayMean.payMode]">
            <el-row>
              <el-col :span="18">
                <img :src="`${CDN_STATIC_HOST}${payModeIcons[commonPayMean.payMode]}`"> {{commonPayMean.payMeansName}}
              </el-col>
              <el-col :span="6" class="text-right">
                <el-radio class="radio" v-model="form.payMeansId" :label="commonPayMean.payMeansId" :disabled="!canPay">&nbsp;</el-radio>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="fixed-bt" v-if="canPay">
      <el-row>
        <el-col :span="16">
          <div class="money" :class="{'mg-money': usePubService}">
            实付
            <span class="price">{{priceText(totalPrice)}}</span> 元
            <div class="sub-money" v-show="usePubService">
              <span v-show="couponPrice > 0">
                优惠
                <span class="price">{{priceText(couponPrice)}}</span> 元
              </span>
              <span v-show="deductionPrice > 0">
                服务抵扣
                <span class="price">{{priceText(deductionPrice)}}</span> 元
              </span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="btn" @click="toPay">支付</div>
        </el-col>
      </el-row>
    </div>

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
import bdStyleMixin, { DefaultConfig } from '../vue-features/mixins/body-style'
// nuxt.config.js的externals配置似乎不可用
// import wx from 'jweixin'
const wx = process.browser ? window.wx || {} : {}

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
  mounted() {
    if (this.isClient) { // 微信SPA认证问题
      location.replace(location.href)
      return
    }
    this.$http.get('/pay/main.do', {
      dealId: this.dealId
    }).then(data => {
      if (process.browser) {
        this.mq()
      }
      data = data || {}
      data.dealInfo = data.dealInfo || {}
      data.dealInfo.commonPay = data.dealInfo.commonPay || {}

      // TEST
      // data.publicAccount = data.publicAccount || {}
      // data.publicAccount.amountAvail = 0.5

      _.assign(this.serverData, data)

      this.$nextTick().then(() => {
        this.form.payMeansId = this.canUseBalance ? 5 : ((this.serverData.commonPayMeans || [])[0] || {}).payMeansId

        if (this.totalPrice <= 0 && this.form.pubServiceId == null) { // 没有服务之前价格为0
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
    // @click.prevent
    onPubServiceClick(event) {
      const dom = event.currentTarget
      const radio = this.$refs['pbs'].find(pbs => {
        return pbs.$el.parentNode === dom
      })
      // console.log(radio.label, radio.value, this.form.pubServiceId)
      if (this.form.pubServiceId && radio.label === this.form.pubServiceId) { // 当前选中
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
      this.$http.post('/deal/cancel.do', {
        dealId: this.serverData.dealInfo.deal.id
      }).then(data => {
        this.$router.push('/order')
      })
    },
    toPay() {
      if (this.payMode === 5 || this.totalPrice <= 0) { // 账户支付
        this.$http.post('/pay/pubAccountPay.do', {
          dealId: this.dealId,
          pubServiceAccountId: this.form.pubServiceId
        }).then(data => {
          this.$router.push(`/pay/result/${this.dealId}`)
        })
        return
      }
      if (this.payMode === 7) { // 微信支付
        if (utils.isWeiXin()) { // 在微信中
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
                    pubServiceAccountId: this.form.pubServiceId,
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
                        this.$router.push(`/pay/result/${this.dealId}`) // 支付成功后的回调函数
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
      } else if (this.payMode === 2) { // 支付宝
        if (utils.isWeiXin()) { // 在微信中
          this.showBrowserTip()
        } else {
          this.$http.post('/pay/zfbPay.do', {
            dealId: this.dealId,
            pubServiceAccountId: this.form.pubServiceId,
            payMeansId: this.form.payMeansId,
            returnUrl: `/pay/result/${this.dealId}`
          }).then(data => {
            data = data || {}
            _.assign(this.alipayForm, {
              action: data['action'],
              fields: Object.keys(data).filter(key => {
                return key !== 'action'
              }).map(key => {
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
    mq() { // 刷新当前时间
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
      return (this.serverData.publicAccount || {}).amountAvail
    },
    canUseBalance() {
      return this.amountAvail >= this.totalPrice
    },
    payMode() {
      return ((this.serverData.commonPayMeans || []).find(item => {
        return item.payMeansId === this.form.payMeansId
      }) || {}).payMode || this.form.payMeansId
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
        await this.$http.get('/pay/calcPubServicePrice.do', {
          dealId: this.dealId,
          pubServiceAccountId: this.form.pubServiceId
        }).then(data => {
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
      alipayForm: { // 支付宝支付表单
        action: null,
        fields: []
      },
      serverData: {
        pubServiceAccount: [],
        payWaitTime: 0,
        payExpireTime: 0,
        publicAccount: {},
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
      wxCode: this.$route.query['code']
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
@mixin priceStyle() {
  color: #FF5E20;
  font-size: 22px;
}

.container {
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
  .main-box {
    >.el-row {
      font-size: 13px;
      padding: 5px;
      >.el-col {
        padding: 8px;
        .stamp {
          .description {
            padding: 3px 0;
            .desc-avail,
            .desc-enjoy {
              margin-right: 5px;
            }
            .desc-avail {
              color: #f52;
            }
            .desc-enjoy {
              color: #1cc3b5;
            }
            .desc-name {
              font-size: 15px;
              font-weight: bolder;
            }
            .desc-desc {
              color: #666;
            }
          }
        }
        .price {
          color: #ff5e20
        }
        .el-row {
          .el-col {
            padding: 8px 0;
          }
        }
        img {
          height: 20px;
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
        }
        .pay-mode {
          height: 45px;
          border-bottom: 1px solid #eee;
          .el-row {
            .el-col {
              .balance-desc {
                font-size: 12px;
                color: #ff5e20;
              }
              img {
                height: auto;
                width: 30px;
                vertical-align: middle;
              }
            }
          }
        }
      }
      .auto-cancel-tip {
        color: #1cc3b5;
        font-size: 15px;
        .how-long,
        .when-time {
          color: #ff4949;
        }
        img {
          width: 35px;
          height: auto;
          margin-right: 5px;
        }
        span {
          vertical-align: baseline;
        }
      }
      >.el-col {
        &:first-child {
          height: 36px;
          line-height: 20px;
          background-color: rgba(218, 218, 218, 0.5);
        }
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
        font-size: 14px;
        .money,
        .btn {
          padding: 10px 0;
        }
        .money {
          position: relative;
          .price {
            @include priceStyle
          }
        }
        .mg-money {
          padding: 0 0 20px 0;
          .sub-money {
            position: absolute;
            bottom: 0;
            font-size: 12px;
            width: 100%;
            color: #999;
            .price {
              font-size: 18px;
            }
          }
        }
        .btn {
          background-color: #FF5E20;
          color: white;
          line-height: 25px;
        }
      }
    }
  }
}
</style>

