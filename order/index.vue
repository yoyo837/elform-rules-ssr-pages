<template>
  <section class="container container-pd">
    <Card title-text="我的订单" title-icon="fa fa-id-card">
      <div class="col-percent el-card__edge el-card__edge-bottom el-card__edge-nobody">
        <div class="col-percent-20 text-overflow" :class="{'item-seleted': params.dealStatus == null}" @click="switchTab($event)">
          <el-button type="text" class="full-width">全部</el-button>
          <div class="btn-selected-tag"></div>
        </div>
        <div class="col-percent-20 text-overflow" :class="{'item-seleted': params.dealStatus == DealStatusMap.NOT_PAY}" @click="switchTab($event, DealStatusMap.NOT_PAY)">
          <el-button type="text" class="full-width">待支付</el-button>
          <div class="btn-selected-tag"></div>
        </div>
        <div class="col-percent-20 text-overflow" :class="{'item-seleted': params.dealStatus == DealStatusMap.NOT_USE}" @click="switchTab($event, DealStatusMap.NOT_USE)">
          <el-button type="text" class="full-width">待使用</el-button>
          <div class="btn-selected-tag"></div>
        </div>
        <div class="col-percent-20 text-overflow" :class="{'item-seleted': params.dealStatus == DealStatusMap.COMPLETE}" @click="switchTab($event, DealStatusMap.COMPLETE)">
          <el-button type="text" class="full-width">已完成</el-button>
          <div class="btn-selected-tag"></div>
        </div>
        <div class="col-percent-20 text-overflow" :class="{'item-seleted': params.dealStatus == DealStatusMap.CANCEL}" @click="switchTab($event, DealStatusMap.CANCEL)">
          <el-button type="text" class="full-width">已取消</el-button>
          <div class="btn-selected-tag"></div>
        </div>
      </div>
    </Card>
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight}">
      <mt-loadmore v-if="list && list.length" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
        <Card v-for="item in list" :key="item.deal.dealId" :title-text="`订单号：${item.deal.dealId}`">
          <template slot="header-desc">
            <span :class="`deal-status-${item.deal.dealStatus}`">{{item.deal.dealStatusValue}}</span>
            <span :class="`deal-status-${item.deal.dealStatus}`">
              <i class="el-icon-delete"></i>
            </span>
          </template>
          <div class="order-content">
            <!-- 场地 -->
            <div class="order-content-item" v-for="dealPlatform in item.dealPlatformList" :key="dealPlatform.dealPlatformId">
              <img class="item-img" :src="`${(item.commonSales.picUrl || [])[1] || `${CDN_IMG_HOST}/commonsales/0/`}58X58.gif`">
              <div class="item-ctt text-overflow">
                <div class="item-ctt-title">
                  {{dealPlatform.salesName}}
                </div>
                <div class="item-ctt-desc">
                  <el-row>
                    <el-col :span="20">
                      {{dealPlatform.platformName}} {{dealPlatform.startTime}}-{{dealPlatform.endTime}}
                    </el-col>
                    <el-col :span="4" class="text-center">
                      ￥{{dealPlatform.transactionPrice || dealPlatform.platformPrice}}
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <!-- 服务人员 -->
            <div class="order-content-item" v-for="serviceUser in item.dealServiceUserList" :key="serviceUser.sysUserId">
              <img class="item-img" :src="`${(serviceUser.picUrl || [])[1] || `${CDN_IMG_HOST}/user/0/`}60X60.jpg`">
              <div class="item-ctt text-overflow">
                <div class="item-ctt-title">
                  {{serviceUser.career}}
                </div>
                <div class="item-ctt-desc">
                  <el-row>
                    <el-col :span="20">
                      {{serviceUser.professional}}-{{serviceUser.realName}}
                    </el-col>
                    <el-col :span="4" class="text-center">
                      ￥{{serviceUser.transactionPrice || serviceUser.servicePrice}}
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <!-- 商品 -->
            <template v-for="dealItem in item.dealItemList">
              <div class="order-content-item" v-for="dealItemSnap in dealItem.dealItemSnapList" :key="dealItemSnap.itemId">
                <img class="item-img" :src="`${(dealItemSnap.picUrl || [])[1] || `${CDN_IMG_HOST}/gift/0/`}60X60.jpg`">
                <div class="item-ctt text-overflow">
                  <div class="item-ctt-title">
                    {{dealItemSnap.itemName}}
                  </div>
                  <div class="item-ctt-desc">
                    <el-row>
                      <el-col :span="20">
                        {{dealItemSnap.itemNum}}{{dealItemSnap.itemUnit}}
                      </el-col>
                      <el-col :span="4" class="text-center">
                        ￥{{dealItemSnap.transactionTotalPrice || dealItemSnap.itemTotalPrice}}
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </template>
            <!-- 票务 -->
            <div class="order-content-item" v-for="dealTicket in item.dealTicketList" :key="dealTicket.dealTicketId">
              <img class="item-img" :src="`${(dealTicket.picUrl || [])[1] || `${CDN_IMG_HOST}/exerciselist/0/`}125X80.jpg`">
              <div class="item-ctt text-overflow">
                <div class="item-ctt-title">
                  {{dealTicket.ticketName}}
                </div>
                <div class="item-ctt-desc">
                  <el-row>
                    <el-col :span="20">
                      {{dealTicket.orderDate}} {{dealTicket.startTime}} {{dealTicket.salesNum}}张
                    </el-col>
                    <el-col :span="4" class="text-center">
                      ￥{{dealTicket.transactionTotalPrice || dealTicket.ticketPrice}}
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <!-- 报名 -->
            <div class="order-content-item" v-for="dealSignup in item.dealSignupList" :key="dealSignup.dealSignupId">
              <img class="item-img" :src="`${(dealSignup.picUrl || [])[1] || `${CDN_IMG_HOST}/exerciselist/0/`}125X80.jpg`">
              <div class="item-ctt text-overflow">
                <div class="item-ctt-title">
                  {{dealSignup.objectName}}
                </div>
                <div class="item-ctt-desc">
                  <el-row>
                    <el-col :span="20">
                      {{dealSignup.objectStartDate}}至{{dealSignup.objectEndDate}}
                    </el-col>
                    <el-col :span="4" class="text-center">
                      ￥{{dealSignup.transactionPrice || dealSignup.signupPrice}}
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <!-- 会员服务 -->
            <div class="order-content-item" v-for="servicePub in item.dealServicePubList" :key="servicePub.serviceId">
              <img class="item-img" :src="`${(servicePub.picUrl || [])[1] || `${CDN_IMG_HOST}/pubservice/0/`}140X90.jpg`">
              <div class="item-ctt text-overflow">
                <div class="item-ctt-title">
                  {{servicePub.serviceName}}
                </div>
                <div class="item-ctt-desc">
                  <el-row>
                    <el-col :span="20">
                      {{servicePub.salesName}}
                    </el-col>
                    <el-col :span="4" class="text-center">
                      ￥{{servicePub.transactionTotalPrice || servicePub.servicePrice}}
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </mt-loadmore>
    </div>
    <Card v-if="list == null || list.length === 0">
      <div class="empry-order-list text-center">
        暂无订单
      </div>
    </Card>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import Card from '../vue-features/components/Card'
import { Row, Col, Button } from 'element-ui'
import { Loadmore } from 'mint-ui'
import bdStyleMixin from '../vue-features/mixins/body-style'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(Loadmore.name, Loadmore)

export default {
  head() {
    return {
      title: '我的订单'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    Card
  },
  mounted() {
    this.$nextTick().then(() => {
      this.loadBottom()
    })
  },
  computed: {
    wrapperHeight() {
      if (this.list == null || this.list.length === 0) {
        return 'auto'
      }
      const wrapper = this.$refs['wrapper']
      return `${document.documentElement.clientHeight -
        wrapper.getBoundingClientRect().top -
        window.parseFloat(window.getComputedStyle(wrapper).marginTop) -
        2}px`
    }
  },
  methods: {
    loadBottom() {
      if (this.allLoaded) {
        return
      }
      this.$http
        .get(
          '/deal/list.do',
          _.assign(
            {
              page: this.serverData.page + 1,
              pageSize: this.pageSize
            },
            this.params
          )
        )
        .then(data => {
          _.assign(this.serverData, {
            page: data.page,
            total: data.total
          })
          const oldLength = this.list.length
          this.list.push.apply(
            this.list,
            (data.rows || []).map(item => {
              // 处理一下字段再给到vm
              item.deal = item.deal || {}
              item.commonPay = item.commonPay || {}
              item.commonSales = item.commonSales || {}
              return item
            })
          ) // 追加

          if (this.list.length - oldLength < this.pageSize || this.list.length >= this.serverData.total) {
            // 没用响应满页或者超过总数
            this.allLoaded = true
          }

          const loadmore = this.$refs['loadmore']
          loadmore && loadmore.onBottomLoaded()
        })
    },
    toPay(id) {
      this.$router.push(`/pay/${id}`)
    },
    switchTab(event, status) {
      this.params.dealStatus = status
      this.list = []
      this.serverData = {
        page: 0,
        total: 0
      }
      this.loadBottom()
    }
  },
  data() {
    return {
      allLoaded: false,
      list: [],
      pageSize: 4,
      params: {
        dealStatus: null
      },
      serverData: {
        page: 0,
        total: 0
      },
      // orderTypes: {
      //   '49': '场地',
      //   '50': '服务人员',
      //   '55': '商品',
      //   '57': '会员服务',
      //   '99': '票务',
      //   '100': '报名'
      // },
      DealStatusMap: {
        NOT_PAY: 1,
        NOT_USE: 2,
        COMPLETE: 3,
        CANCEL: 4
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  [class^='col-percent-'] {
    position: relative;
    .btn-selected-tag {
      position: absolute;
      bottom: 0;
      height: 2px;
      width: 100%;
      background-color: transparent;
    }
    &.item-seleted {
      .btn-selected-tag {
        background-color: #f26a3e;
      }
    }
  }

  .empry-order-list {
    padding: 15px 0;
    color: #999;
    font-size: 12px;
  }

  .order-content {
    .order-content-item {
      padding: 2px 0;
      .item-img {
        width: 40px;
        height: 40px;
        vertical-align: top;
      }
      .item-ctt {
        display: inline-block;
        width: calc(100% - 40px);
        height: 40px;
        padding-left: 8px;
        .item-ctt-title {
          color: #222;
          line-height: 25px;
        }
        .item-ctt-desc {
          font-size: 12px;
          color: #999;
          line-height: 15px;
        }
      }
    }
  }
}
</style>


