<template>
  <section class="container">
    <div class="main-box">
      <el-row>
        <el-col :span="24">
          <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/deal_s.png`">
          <span>订单信息</span>
        </el-col>
        <el-col :span="24" class="ctx-bg">
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
          <div class="pay-info">

          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/fw_style.png`">
          <span>优惠服务</span>
        </el-col>
        <el-col :span="24" class="ctx-bg">

        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/zf_style.png`">
          <span>支付方式</span>
        </el-col>
        <el-col :span="24" class="ctx-bg">

        </el-col>
      </el-row>
    </div>
    <div class="fixed-bt">
      <el-row>
        <el-col :span="16">
          <div class="money">
            共计{{serverData.totalPrice}}元
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
import { Row, Col, Button } from 'element-ui'
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
    })
  },
  methods: {
    toPay() {
      this.$wxConfig(true).then(data => {
        alert(JSON.stringify(data))
      })
    }
  },
  data() {
    return {
      serverData: {
        dealInfo: {}
      },
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

