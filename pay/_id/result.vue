<template>
  <section class="container container-pd">
    <template v-if="serverData.paySuccess">
      <Card class="card-status text-center">
        <i class="icon-pt-complate" aria-hidden="true"></i>
        你已成功支付！
      </Card>
      <Card>
        <OrderList :deal-info="serverData.dealInfo" size="large"></OrderList>
        <div class="amount-list">
          <el-row>
            <el-col :span="18">
              订单合计：
            </el-col>
            <el-col :span="6" class="text-right">
              ￥{{serverData.dealInfo.commonPay.payFeeTotal || 0}}
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
          <el-row v-if="serverData.dealInfo.commonPay.payPointsTotal">
            <el-col :span="18">
              积分支付：
            </el-col>
            <el-col :span="6" class="text-right">
              {{serverData.dealInfo.commonPay.payPointsTotal || 0}}分
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col :span="18">
              实付款：
            </el-col>
            <el-col :span="6" class="text-right">
              ￥{{serverData.dealInfo.commonPay.payFeePaid || 0}}
            </el-col>
          </el-row>
        </div>
      </Card>

      <section class="operation">
        <el-row :gutter="5">
          <el-col :span="24">
            <nuxt-link :to="`/order/${dealId}`">
              <el-button type="primary" class="full-width shadow-button">查看订单</el-button>
            </nuxt-link>
          </el-col>
          <el-col :span="(hasPlatform || hasTicket) ? 12 : 24">
            <nuxt-link to="/">
              <el-button class="el-button--white full-width shadow-button">回到首页</el-button>
            </nuxt-link>
          </el-col>
          <el-col :span="12" v-if="hasPlatform || hasTicket">
            <nuxt-link v-if="hasPlatform" :to="`/booking/schedule/${serverData.dealInfo.dealPlatformList[0].salesId}`">
              <el-button class="el-button--white full-width shadow-button">继续订场</el-button>
            </nuxt-link>
            <nuxt-link v-else-if="hasTicket" :to="`/ticket/${serverData.dealInfo.dealTicketList[0].dataId}`">
              <el-button class="el-button--white full-width shadow-button">继续购票</el-button>
            </nuxt-link>
          </el-col>
        </el-row>
      </section>
    </template>
    <template v-else>
      <div class="text-center">请稍后...</div>
    </template>

  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import math from '../../../components/math'
import popup from '../../../components/popup'
import { Row, Col, Button } from 'element-ui'
import Card from '../../vue-features/components/Card'
import OrderList from '../../vue-features/components/OrderList'
import bdStyleMixin from '../../vue-features/mixins/body-style'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: this.title
    }
  },
  mixins: [bdStyleMixin],
  components: {
    Card,
    OrderList
  },
  mounted() {
    this.$http.get('/pay/payResult.do', {
      dealId: this.dealId
    }).then(data => {
      data = data || {}
      data.dealInfo = data.dealInfo || {}
      data.dealInfo.commonPay = data.dealInfo.commonPay || {}

      _.assign(this.serverData, data)

      if (this.serverData.paySuccess) {
        this.title = '支付成功'
        // popup.alert('支付成功，正在跳转', {
        //   callback: () => {
        //     // this.$router.replace(`/order/${this.dealId}?out_trade_no=${this.dealId}`)
        //   }
        // })
      } else {
        popup.alert('订单未成功支付，跳转到支付页面', {
          callback: () => {
            this.$router.replace(`/pay/${this.dealId}`)
          }
        })
      }
    })
  },
  computed: {
    hasPlatform() {
      return this.serverData.dealInfo.dealPlatformList && this.serverData.dealInfo.dealPlatformList.length > 0
    },
    hasTicket() {
      return this.serverData.dealInfo.dealTicketList && this.serverData.dealInfo.dealTicketList.length > 0
    },
    discountAmount() {
      if (this.serverData.dealInfo.commonPay.payPointsTotal > 0) {
        return 0
      }
      return math.sub(this.serverData.dealInfo.commonPay.payFeeTotal || 0, this.serverData.dealInfo.commonPay.payFeePaid || 0)
    }
  },
  data() {
    return {
      title: '确认支付结果...',
      serverData: {
        dealInfo: {
          commonPay: {}
        },
        paySuccess: false
      },
      paid: false,
      dealId: this.$route.params['id']
    }
  }
}
</script>

<style lang="scss" scoped>
.card-status {
  i {
    font-size: 32px;
    color: #3ebd00;
    vertical-align: middle;
  }
}

.amount-list {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  .el-row {
    padding: 3px 0;
    .el-col {
      &:last-child {
        color: #f26a3e;
      }
    }
  }
}
</style>

