<template>
  <section class="container container-pd">
    <Card title-text="我的订单" title-icon="fa fa-id-card">
      <div class="col-percent el-card__edge el-card__edge-bottom el-card__edge-nobody">
        <div class="col-percent-20 text-overflow item-seleted">
          <el-button type="text" class="full-width">全部</el-button>
          <div class="btn-selected-tag"></div>
        </div>
        <div class="col-percent-20 text-overflow">
          <el-button type="text" class="full-width">待支付</el-button>
          <div class="btn-selected-tag"></div>
        </div>
        <div class="col-percent-20 text-overflow">
          <el-button type="text" class="full-width">待使用</el-button>
          <div class="btn-selected-tag"></div>
        </div>
        <div class="col-percent-20 text-overflow">
          <el-button type="text" class="full-width">已完成</el-button>
          <div class="btn-selected-tag"></div>
        </div>
        <div class="col-percent-20 text-overflow">
          <el-button type="text" class="full-width">已取消</el-button>
          <div class="btn-selected-tag"></div>
        </div>
      </div>
    </Card>

    <mt-loadmore v-if="list && list.length" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
      <Card v-for="item in list" :key="item.id" :title-text="`订单号：${item.id}`">
        <template slot="header-desc">
          <span>订单状态</span>
          <span>
            <i class="el-icon-delete"></i>
          </span>
        </template>
      </Card>
    </mt-loadmore>
    <Card v-else>
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
    this.loadBottom()
  },
  methods: {
    loadBottom() {
      if (this.allLoaded) {
        return
      }
      this.$http
        .get('/deal/list.do', {
          page: this.serverData.page + 1,
          pageSize: this.pageSize
        })
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
              try {
                item.fields = JSON.parse(item.descr)
              } catch (e) {
                console.log(e)
              }
              delete item.descr
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
    }
  },
  data() {
    return {
      allLoaded: false,
      list: [],
      pageSize: 10,
      serverData: {
        page: 0,
        total: 0
      },
      orderTypes: {
        '49': '场地',
        '50': '服务人员',
        '55': '商品',
        '57': '会员服务',
        '99': '票务',
        '100': '报名'
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

  .mint-loadmore {
    margin-top: 8px;
  }

  .empry-order-list {
    padding: 15px 0;
    color: #999;
    font-size: 12px;
  }
}
</style>


