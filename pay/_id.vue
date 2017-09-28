<template>
  <section class="container">
    <div class="main-box">
      <el-row>
        <el-col :span="24">
          <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/deal_s.png`">
          <span>订单信息</span>
        </el-col>
        <el-col :span="24" class="ctx-bg">
          <!-- 订场 -->
          <div class="pay-item" v-for="dealPlatform in serverData.dealInfo.dealPlatformList" :key="dealPlatform.id">
            <el-row>
              <el-col :span="6">场地：</el-col>
              <el-col :span="18">{{dealPlatform.orderDateValue}} {{dealPlatform.startTimeValue}}-{{dealPlatform.endTimeValue}} {{dealPlatform.platformParentName}}{{dealPlatform.platformName}}</el-col>
              <el-col :span="24" class="text-right" v-if="dealPlatform.isFightDeal">约战</el-col>
              <el-col :span="24" class="text-right">￥{{dealPlatform.transactionPriceValue}}</el-col>
            </el-row>
          </div>
          <!-- 服务人员 -->
          <div class="pay-item" v-for="dealServiceUser in serverData.dealInfo.dealServiceUserList" :key="dealServiceUser.id">
            <el-row>
              <el-col :span="6">教练：</el-col>
              <el-col :span="18">{{dealServiceUser.orderDateValue}} {{dealServiceUser.startTimeValue}}-{{dealServiceUser.endTimeValue}} {{dealServiceUser.realName}}</el-col>
              <el-col :span="24" class="text-right" v-if="dealServiceUser.isFight">约战付一半</el-col>
              <el-col :span="24" class="text-right">￥{{dealServiceUser.transactionPriceValue}}</el-col>
            </el-row>
          </div>
          <!-- 商品 -->
          <div class="pay-item" v-for="(dealItemList, i) in serverData.dealInfo.dealItemList" :key="i">
            <template v-for="dealItemSnap in dealItemList">
              <el-row :key="dealItemSnap.id">
                <el-col :span="6">商品：</el-col>
                <el-col :span="18">{{dealItemSnap.itemName}} {{dealItemSnap.attrOptionValue1}} {{dealItemSnap.attrOptionValue2}}/{{dealItemSnap.itemNum}}{{dealItemSnap.itemUnit}}</el-col>
                <el-col :span="24" class="text-right">￥{{dealItemSnap.transactionTotalPriceValue}}</el-col>
              </el-row>
            </template>
          </div>
          <!-- 报名 -->
          <div class="pay-item" v-for="dealSignup in serverData.dealInfo.dealSignupList" :key="dealSignup.id">
            <el-row>
              <el-col :span="6">报名：</el-col>
              <el-col :span="18">{{dealSignup.exerciseList.exerciseName}}</el-col>
              <el-col :span="24" class="text-right">￥{{dealSignup.transactionPriceValue}}</el-col>
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
              <el-col :span="18">{{dealServicePub.serviceName}}</el-col>
              <el-col :span="24" class="text-right">￥{{dealServicePub.transactionTotalPriceValue}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">数量：</el-col>
              <el-col :span="18">{{dealServicePub.buyNum}}张</el-col>
            </el-row>
          </div>
          <div class="pay-info">
            <el-row>
              <el-col :span="8">订单总金额：</el-col>
              <el-col :span="16" class="text-right"></el-col>
            </el-row>
            <el-row>
              <el-col :span="8">需支付金额：</el-col>
              <el-col :span="16" class="text-right"></el-col>
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
          <div class="pay-mode">
            <el-row v-if="serverData.publicAccount.amountAvail > 0">
              <el-col :span="18">
                <img :src="`${CDN_STATIC_HOST}/${payModeIcons[5]}`"> 会员账户支付
              </el-col>
              <el-col :span="6" class="text-right">
                <el-checkbox v-model="form.useBalance">&nbsp;</el-checkbox>
              </el-col>
            </el-row>
          </div>
          <div class="pay-mode" v-for="(commonPayMean, i) in serverData.commonPayMeans" :key="commonPayMean.payMode" v-if="payModeIcons[commonPayMean.payMode]">
            <el-row>
              <el-col :span="18">
                <img :src="`${CDN_STATIC_HOST}${payModeIcons[commonPayMean.payMode]}`"> {{commonPayMean.payMeansName}}
              </el-col>
              <el-col :span="6" class="text-right">
                <el-radio class="radio" v-model="form.payMode" :label="commonPayMean.payMode">&nbsp;</el-radio>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="fixed-bt">
      <el-row>
        <el-col :span="16">
          <div class="money">
            实付{{totalPrice}}元
          </div>
        </el-col>
        <el-col :span="8">
          <div class="btn" @click="toPay">支付</div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import utils from '../../components/utils'
import popup from '../../components/popup'
import { Row, Col, Button, Radio, Checkbox } from 'element-ui'
import bdStyleMixin, { DefaultConfig } from '../vue-features/mixins/body-style'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(Radio.name, Radio)
Vue.component(Checkbox.name, Checkbox)

export default {
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
    this.$http.get('/pay/main.do', {
      dealId: this.dealId
    }).then(data => {
      data = data || {}
      data.dealInfo = data.dealInfo || {}
      _.assign(this.serverData, data)

      this.form.useBalance = (this.serverData.publicAccount || {}).amountAvail > 0
      this.form.payMode = ((this.serverData.commonPayMeans || [])[0] || {}).payMode
    })
  },
  methods: {
    toPay() {
      if (this.form.payMode === 7 && !utils.isWeiXin()) { // 选择微信支付但不在微信中
        popup.alert('正在呼起微信App, 请在微信中继续操作...')
        //
      }
      // this.$wxConfig(true).then(data => {
      //   alert(JSON.stringify(data))
      // })
    }
  },
  data() {
    return {
      payModeIcons: {
        '2': '/themes/mobile/common/images/zf.png',
        '5': '/themes/mobile/common/images/vip.png',
        '7': '/themes/mobile/common/images/wx.png',
        '8': '/themes/mobile/common/images/fee.png'
      },
      form: {
        useBalance: false,
        payMode: null
      },
      serverData: {
        pubServiceAccount: [],
        publicAccount: {},
        dealInfo: {}
      },
      totalPrice: 0,
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-pay`,
      dealId: this.$route.params['id']
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
.container {
  .main-box {
    >.el-row {
      font-size: 13px;
      padding: 5px;
      >.el-col {
        padding: 8px;
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
              img {
                height: auto;
                width: 30px;
                vertical-align: middle;
              }
            }
          }
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

