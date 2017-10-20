<template>
  <section class="container container-pd">
    <Card title-text="我的订单" title-icon="fa fa-id-card">
      123
      <el-row class="el-card__edge el-card__edge-bottom">
        <el-col :span="4" :push="1">
          <el-button type="text" class="full-width">去签到</el-button>
        </el-col>
        <el-col :span="4" :push="1">
          <el-button type="text" class="full-width">去签到</el-button>
        </el-col>
        <el-col :span="4" :push="1">
          <el-button type="text" class="full-width">去签到</el-button>
        </el-col>
        <el-col :span="4" :push="1">
          <el-button type="text" class="full-width">去签到</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="text" class="full-width">去签到</el-button>
        </el-col>
      </el-row>
    </Card>

    <Card>

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

