<template>
  <section class="container container-pd">
    <Card title-text="我的订单" title-icon="icon-pt-order">
      <div class="col-percent el-card__edge el-card__edge-bottom el-card__edge-nobody">
        <div class="col-percent-20 text-overflow" :class="{'item-seleted': params.dealStatus == null}" @click="switchTab()">
          <el-button type="text" class="full-width">全部</el-button>
          <div class="btn-selected-tag"></div>
        </div>
        <div class="col-percent-20 text-overflow" :class="{'item-seleted': params.dealStatus == DealStatusMap.COMPLETE}" @click="switchTab(DealStatusMap.COMPLETE)">
          <el-button type="text" class="full-width">已完成</el-button>
          <div class="btn-selected-tag"></div>
        </div>
        <div class="col-percent-20 text-overflow" :class="{'item-seleted': params.dealStatus == DealStatusMap.NOT_PAY}" @click="switchTab(DealStatusMap.NOT_PAY)">
          <el-button type="text" class="full-width">待支付</el-button>
          <div class="btn-selected-tag"></div>
        </div>
        <div class="col-percent-20 text-overflow" :class="{'item-seleted': params.dealStatus == DealStatusMap.REFUNDED}" @click="switchTab(DealStatusMap.REFUNDED)">
          <el-button type="text" class="full-width">已退款</el-button>
          <div class="btn-selected-tag"></div>
        </div>
        <div class="col-percent-20 text-overflow" :class="{'item-seleted': params.dealStatus == DealStatusMap.CANCEL}" @click="switchTab(DealStatusMap.CANCEL)">
          <el-button type="text" class="full-width">已取消</el-button>
          <div class="btn-selected-tag"></div>
        </div>
      </div>
    </Card>
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight}">
      <mt-loadmore v-if="list && list.length" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
        <Card v-for="item in list" :key="item.deal.dealId" :title-text="`订单号：${item.deal.dealId}`" @click.native="toDetail(item.deal.dealId)">
          <template slot="header-desc">
            <span :class="`deal-status-${item.deal.dealStatus}`">{{item.deal.dealStatusValue}}</span>
            <span v-if="item.deal.dealStatus == DealStatusMap.CANCEL" :class="`deal-status-${item.deal.dealStatus}`" @click.stop="toDel(item.deal.dealId)">
              <i class="icon-pt-del"></i>
            </span>
          </template>
          <OrderList :deal-info="item"></OrderList>

          <el-row v-if="item.deal.dealStatus == DealStatusMap.NOT_PAY" class="el-card__edge el-card__edge-bottom">
            <el-col :span="12">
              <el-button type="text" class="full-width" @click.stop="toCancel(item.deal.dealId)">取消</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="text" class="full-width" @click.stop="toPay(item.deal.dealId)">去支付</el-button>
            </el-col>
          </el-row>
          <div v-else-if="item.deal.dealStatus == DealStatusMap.COMPLETE && (item.deal.latestCancelTime > +now.format('x'))" class="el-card__edge el-card__edge-bottom sign-cancel">
            <div class="sign-cancel-desc">
              <i aria-hidden="true" class="el-icon-warning"></i>{{item.deal.latestCancelDescr}}
            </div>
            <div class="sign-cancel-exec">
              <el-button type="text" class="full-width">取消</el-button>
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
import moment from 'moment'
import Vue from 'vue'
import utils from '../../components/utils'
import popup from '../../components/popup'
import Card from '../vue-features/components/Card'
import OrderList from '../vue-features/components/OrderList'
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
    Card,
    OrderList
  },
  mounted() {
    this.$nextTick().then(() => {
      if (process.browser) {
        this.mq()
      }
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
    mq() {
      // 刷新当前时间
      this.now = moment()
      if (this.timerSwitch) {
        setTimeout(this.mq, 1000 * 1)
      }
    },
    loadBottom() {
      if (this.allLoaded) {
        return
      }
      this.$http.get('/deal/list.do', _.assign({
        page: this.serverData.page + 1,
        pageSize: this.pageSize
      }, this.params)).then(data => {
        _.assign(this.serverData, {
          page: data.page,
          total: data.total
        })
        const oldLength = this.list.length
        this.list.push.apply(this.list, (data.rows || []).map(item => {
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
    toDel(id) {
      popup.confirm('确认删除订单吗？').then(action => {
        this.$http.post('/deal/delete.do', {
          dealId: id
        }).then(data => {
          this.reload()
        })
      })
    },
    toCancel(id) {
      popup.confirm('确认取消订单吗？').then(action => {
        this.$http.post('/deal/cancel.do', {
          dealId: id
        }).then(data => {
          this.reload()
        })
      })
    },
    switchTab(status) {
      this.params.dealStatus = status
    },
    toDetail(dealId) {
      this.$router.push(`/order/${dealId}`)
    },
    reload() {
      this.list = []
      this.allLoaded = false
      this.serverData = {
        page: 0,
        total: 0
      }
      this.loadBottom()
    }
  },
  watch: {
    'params.dealStatus'() {
      this.reload()
    }
  },
  data() {
    return {
      now: moment(),
      timerSwitch: true,
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
      DealStatusMap: utils.DealStatusMap
    }
  },
  destroyed() {
    this.timerSwitch = false
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

  .sign-cancel {
    .sign-cancel-desc,
    .sign-cancel-exec {
      display: inline-block;
    }
    .sign-cancel-desc {
      padding-left: 15px;
      width: calc(100% - 60px);
      i {
        font-size: 16px;
        vertical-align: middle;
        color: #f26a3e;
      }
    }
    .sign-cancel-exec {
      width: 60px;
      border-left: none !important;
      .el-button {
        padding: 0;
        margin: 10px 0;
        height: 24px;
        border-left: 1px solid #f0f0f0;
      }
    }
  }

  .deal-status-1 {
    color: #f26a3e;
  }
}
</style>


