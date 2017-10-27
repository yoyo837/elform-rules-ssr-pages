<template>
  <section class="container container-pd">
    <Card>
      <div class="order-content">
        <!-- 场地 -->
        <div class="order-content-item" v-for="dealPlatform in serverData.dealPlatformList" :key="dealPlatform.dealPlatformId">
          <img class="item-img" :src="`${((serverData.commonSales || {}).picUrl || [])[1] || `${CDN_IMG_HOST}/commonsales/0/`}58X58.gif`">
          <div class="item-ctt">
            <div class="item-ctt-title text-overflow">
              {{dealPlatform.salesName}}
            </div>
            <div class="item-ctt-desc text-overflow">
              {{dealPlatform.platformName}} {{dealPlatform.startTime}}-{{dealPlatform.endTime}}
            </div>
          </div>
        </div>
        <!-- 服务人员 -->
        <div class="order-content-item" v-for="serviceUser in serverData.dealServiceUserList" :key="serviceUser.sysUserId">
          <img class="item-img" :src="`${(serviceUser.picUrl || [])[1] || `${CDN_IMG_HOST}/user/0/`}60X60.jpg`">
          <div class="item-ctt">
            <div class="item-ctt-title text-overflow">
              {{serviceUser.career}}
            </div>
            <div class="item-ctt-desc text-overflow">
              {{serviceUser.professional}}-{{serviceUser.realName}}
            </div>
          </div>
        </div>
        <!-- 商品 -->
        <template v-for="dealItem in serverData.dealItemList">
          <div class="order-content-item" v-for="dealItemSnap in dealItem.dealItemSnapList" :key="dealItemSnap.itemId">
            <img class="item-img" :src="`${(dealItemSnap.picUrl || [])[1] || `${CDN_IMG_HOST}/gift/0/`}60X60.jpg`">
            <div class="item-ctt">
              <div class="item-ctt-title text-overflow">
                {{dealItemSnap.itemName}}
              </div>
              <div class="item-ctt-desc text-overflow">
                {{dealItemSnap.itemNum}}{{dealItemSnap.itemUnit}}
              </div>
            </div>
          </div>
        </template>
        <!-- 票务 -->
        <div class="order-content-item" v-for="dealTicket in serverData.dealTicketList" :key="dealTicket.dealTicketId">
          <img class="item-img" :src="`${(dealTicket.picUrl || [])[1] || `${CDN_IMG_HOST}/exerciselist/0/`}125X80.jpg`">
          <div class="item-ctt">
            <div class="item-ctt-title text-overflow">
              {{dealTicket.ticketName}}
            </div>
            <div class="item-ctt-desc text-overflow">
              {{dealTicket.orderDate}} {{dealTicket.startTime}} {{dealTicket.salesNum}}张
            </div>
          </div>
        </div>
        <!-- 报名 -->
        <div class="order-content-item" v-for="dealSignup in serverData.dealSignupList" :key="dealSignup.dealSignupId">
          <img class="item-img" :src="`${(dealSignup.picUrl || [])[1] || `${CDN_IMG_HOST}/exerciselist/0/`}125X80.jpg`">
          <div class="item-ctt">
            <div class="item-ctt-title text-overflow">
              {{dealSignup.objectName}}
            </div>
            <div class="item-ctt-desc text-overflow">
              {{dealSignup.objectStartDate}}至{{dealSignup.objectEndDate}}
            </div>
          </div>
        </div>
        <!-- 会员服务 -->
        <div class="order-content-item" v-for="servicePub in serverData.dealServicePubList" :key="servicePub.serviceId">
          <img class="item-img" :src="`${(servicePub.picUrl || [])[1] || `${CDN_IMG_HOST}/pubservice/0/`}140X90.jpg`">
          <div class="item-ctt">
            <div class="item-ctt-title text-overflow">
              {{servicePub.serviceName}}
            </div>
            <div class="item-ctt-desc text-overflow">
              {{servicePub.salesName}}
            </div>
          </div>
        </div>
      </div>
    </Card>
    <div class="clip-section">
      <div class="clip-gap clip-gap-left"></div>
      <div class="clip-line"></div>
      <div class="clip-line"></div>
      <div class="clip-gap clip-gap-right"></div>
    </div>
    <Card class="amount-list">
      <el-row>
        <el-col :span="18">
          订单合计：
        </el-col>
        <el-col :span="6" class="text-right">
          ￥{{serverData.commonPay.payFeeTotal || 0}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          优惠：
        </el-col>
        <el-col :span="6" class="text-right">
          - ￥{{discountAmount}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          实付款：
        </el-col>
        <el-col :span="6" class="text-right">
          ￥{{serverData.commonPay.payFeePaid || 0}}
        </el-col>
      </el-row>
    </Card>
    <Card class="order-status" :title-html="`订单状态：<span style='${serverData.deal.dealStatus != DealStatusMap.COMPLETE ? 'color: #F26A3E' : ''}'>${serverData.deal.dealStatusValue || ''}</span>`">
      <div class="order-status-field">
        创建时间：{{formatDateTime(serverData.deal.createTime)}}
      </div>
      <div class="order-status-field">
        支付时间：
        <template v-if="serverData.deal.dealStatus >= DealStatusMap.COMPLETE">
          {{formatDateTime(serverData.deal.updateTime)}}
        </template>
      </div>
      <!-- <div class="order-status-field">
              完成时间：
            </div> -->
      <div class="ticket-matrix-item text-center" v-for="dealTicket in serverData.dealTicketList" :key="dealTicket.dealTicketId">
        <div class="ticket-desc">
          验证码：
          <span>{{dealTicket.ticketValidCode}}</span>
        </div>
        <img :src="dealTicket.matrixUrl">
        <div class="ticket-name">
          {{dealTicket.ticketName}}
        </div>
      </div>
    </Card>

    <Card v-if="serverData.commonSales" class="venue-info">
      <el-row>
        <el-col :span="18">
          <div class="venue-name">{{serverData.commonSales.salesName}}</div>
          <div class="venue-address">{{serverData.commonSales.province}}{{serverData.commonSales.city}}{{serverData.commonSales.district}}{{serverData.commonSales.salesAddress}}</div>
        </el-col>
        <el-col :span="6">
          <a :href="`tel:${serverData.commonSales.salesTel}`">
            <div class="venue-contact">
              <div>
                <i class="fa fa-phone" aria-hidden="true"></i>
              </div>
              <div>联系商家</div>
            </div>
          </a>
        </el-col>
      </el-row>
    </Card>

    <Card v-if="serverData.deal.remark" :invisible="true" class="terms-conditions">
      <div>使用须知</div>
      <!-- <ul>
              <li>serverData.deal.remark</li>
              <li>sdfdsf</li>
              <li>sdfdsf</li>
              <li>sdfdsf</li>
            </ul> -->
      <div>
        {{serverData.deal.remark}}
      </div>
    </Card>

    <section v-if="serverData.deal.dealStatus == DealStatusMap.NOT_PAY" class="fixed-bt">
      <el-row>
        <el-col :span="12">
          <el-button type="text" class="full-width" @click="toCancel">取消</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="text" class="full-width primary-button" @click="toPay">去支付</el-button>
        </el-col>
      </el-row>
    </section>
    <section v-else-if="serverData.deal.dealStatus == DealStatusMap.COMPLETE" class="fixed-bt">
      <el-row>
        <el-col :span="24">
          <el-button type="text" class="full-width" @click="toCancel">取消</el-button>
        </el-col>
      </el-row>
    </section>
  </section>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import utils from '../../components/utils'
import popup from '../../components/popup'
import math from '../../components/math'
import { Row, Col, Button } from 'element-ui'
import Card from '../vue-features/components/Card'
import bdStyleMixin, { DefaultConfig } from '../vue-features/mixins/body-style'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: `订单详情-${this.dealId}`
    }
  },
  mixins: [bdStyleMixin],
  components: {
    Card
  },
  mounted() {
    this.$http
      .get('/deal/detail.do', {
        dealId: this.dealId
      })
      .then(data => {
        data = data || {}
        data.commonPay = data.commonPay || {}
        // data.commonSales = data.commonSales || {}
        data.deal = data.deal || {}
        _.assign(this.serverData, data)
      })
  },
  computed: {
    discountAmount() {
      return math.sub(this.serverData.commonPay.payFeeTotal || 0, this.serverData.commonPay.payFeePaid || 0)
    }
  },
  methods: {
    formatDateTime: utils.formatDateTime,
    toCancel() {
      popup
        .confirm('确认取消订单吗？')
        .then(action => {
          this.$http
            .post('/deal/cancel.do', {
              dealId: this.dealId
            })
            .then(data => {
              this.$router.push('/order')
            })
        })
        .catch(e => {})
    },
    toPay() {
      this.$router.push(`/pay/${this.dealId}`)
    }
  },
  data() {
    return {
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-order-detail`,
      dealId: this.$route.params['id'],
      serverData: {
        commonSales: null,
        commonPay: {},
        deal: {},
        dealItemList: null,
        dealPlatformList: null,
        dealTicketList: null,
        dealServiceUserList: null,
        dealServicePubList: null,
        dealSignupList: null
      },
      DealStatusMap: utils.DealStatusMap
    }
  }
}
</script>

<style lang="scss">
body.bd-pt-order-detail {
  padding-bottom: 50px;
}
</style>

<style lang="scss" scoped>
.container {
  .order-content {
    .order-content-item {
      padding: 2px 0;
      .item-img {
        width: 50px;
        height: 50px;
        vertical-align: top;
      }
      .item-ctt {
        display: inline-block;
        width: calc(100% - 50px);
        height: 50px;
        padding-left: 8px;
        .item-ctt-title {
          color: #222;
          font-size: 18px;
          font-weight: bolder;
          line-height: 30px;
        }
        .item-ctt-desc {
          line-height: 20px;
        }
      }
    }
  }

  .clip-section {
    position: relative;
    background-color: white;
    .clip-line {
      line-height: 10px;
      height: 10px;
    }
    .clip-line + .clip-line {
      border-top: 2px dashed #f0f0f0;
    }
    .clip-gap {
      position: absolute;
      top: 0;
      width: 10px;
      height: 20px;
      background-color: #f8f8f8;
      display: inline-block;
      border: 1px solid #f0f0f0;
      &.clip-gap-left {
        left: 0;
        border-radius: 0 10px 10px 0;
        border-left: 0;
      }
      &.clip-gap-right {
        right: 0;
        border-radius: 10px 0 0 10px;
        border-right: 0;
      }
    }
  }

  .amount-list {
    .el-row {
      padding: 3px 0;
      .el-col {
        &:last-child {
          color: #f26a3e;
        }
      }
    }
  }

  .order-status {
    .order-status-field {
      padding: 3px 0;
    }

    .ticket-matrix-item {
      margin-top: 25px;
      .ticket-desc,
      .ticket-name {
        padding: 3px 0;
      }
      .ticket-desc {
        color: #222;
        line-height: 18px;
        span {
          color: #f26a3e;
          font-size: 18px;
          vertical-align: top;
        }
      }
      .ticket-name {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .venue-info {
    .venue-name,
    .venue-address {
      padding: 3px 0;
    }
    .venue-address {
      font-size: 12px;
      color: #999;
    }
    .venue-contact {
      text-align: center;
      color: #999;
      font-size: 12px;
      border-left: 1px solid #f0f0f0;
      padding-left: 15px;
      i {
        font-size: 28px;
        color: #666;
      }
    }
  }

  .terms-conditions {
    ul {
      padding-left: 15px;
      li {
        padding: 3px 0;
      }
    }
  }
}
</style>

