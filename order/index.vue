<template>
  <PageContainer :nav-header="true" nav-header-back-path="/user/my">
    <div class="text-center no-more" v-if="list == null || list.length === 0">
      <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/no_icon_1.png`">
      <div>暂无订单!</div>
    </div>
    <mt-loadmore ref="loadmore" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded">
      <nuxt-link tag="div" :to="`/order/${item.id}`" v-for="item in list" :key="item.id" class="order-item">
        <el-row class="nav-panel nav-panel-mini order-header">
          <el-col :span="8">
            <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/deal_h.png`">{{item.id}}
          </el-col>
          <el-col :span="16" class="text-right">
            <i class="el-icon-arrow-right"></i>
          </el-col>
        </el-row>
        <el-row class="nav-panel nav-panel-auto" v-for="(list, key) in item.fields" :key="key" v-if="orderTypes[key]">
          <el-col :span="24" class="order-type">
            {{orderTypes[key]}}
          </el-col>
          <template v-for="field in list">
            <template v-for="(value, key, i) in field">
              <el-col :span="24" class="order-content" :key="i">
                <el-row>
                  <el-col :span="8">
                    {{key}}
                  </el-col>
                  <el-col :span="16" class="text-right">
                    {{value}}
                  </el-col>
                </el-row>
              </el-col>
            </template>
          </template>
        </el-row>
        <el-row class="nav-panel nav-panel-auto">
          <el-col :span="8">
            支付状态
          </el-col>
          <el-col :span="16" class="text-right">
            <el-button v-if="item.payStatus == 0" type="warning" size="mini" @click.stop="toPay(item.id)">{{item.payStatusValue}}</el-button>
            <template v-else>
              {{item.payStatusValue}}
            </template>
          </el-col>
        </el-row>
      </nuxt-link>
    </mt-loadmore>
  </PageContainer>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import PageContainer from '../vue-features/components/PageContainer'
import { Row, Col, Button } from 'element-ui'
import { Loadmore } from 'mint-ui'
import bdStyleMixin from '../vue-features/mixins/body-style'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(Loadmore.name, Loadmore)

export default {
  name: 'orders',
  head() {
    return {
      title: '我的订单'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    PageContainer
  },
  mounted() {
    this.loadBottom()
  },
  methods: {
    loadBottom() {
      this.$http.get('/deal/list.do', {
        page: this.serverData.page + 1,
        pageSize: this.pageSize
      }).then(data => {
        _.assign(this.serverData, {
          page: data.page,
          total: data.total
        })
        const oldLength = this.list.length
        this.list.push.apply(this.list, (data.rows || []).map(item => { // 处理一下字段再给到vm
          try {
            item.fields = JSON.parse(item.descr)
          } catch (e) {
            console.log(e)
          }
          delete item.descr
          return item
        })) // 追加

        if (this.list.length - oldLength < this.pageSize || this.list.length >= this.serverData.total) { // 没用响应满页或者超过总数
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
.order-header {
  background-color: #f7f7f7;
  img {
    margin: 2px;
  }
}

.order-type {
  font-size: 16px;
}

.order-content {
  font-size: 14px;
}

.order-item {
  i {
    color: #aaa;
  }
}

.order-item~.order-item {
  margin-top: 15px;
}
</style>
