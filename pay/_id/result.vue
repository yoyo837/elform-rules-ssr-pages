<template>
  <section class="container container-pd">
    <template v-if="paySuccess">
      <Card class="card-status text-center">
        <i class="el-icon-circle-check" aria-hidden="true"></i>
        你已成功支付！
      </Card>

      <section class="operation">
        <el-row :gutter="5">
          <el-col :span="24">
            <nuxt-link :to="`/order/${dealId}`">
              <el-button type="primary" class="full-width shadow-button">查看订单</el-button>
            </nuxt-link>
          </el-col>
          <el-col :span="12">
            <nuxt-link to="/">
              <el-button class="el-button--white full-width shadow-button">回到首页</el-button>
            </nuxt-link>
          </el-col>
          <el-col :span="12">
            <!-- <nuxt-link to="/booking/schedule/100938"> -->
            <el-button class="el-button--white full-width shadow-button">继续订场</el-button>
            <!-- </nuxt-link> -->
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
import Vue from 'vue'
import popup from '../../../components/popup'
import { Row, Col, Button } from 'element-ui'
import Card from '../../vue-features/components/Card'
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
    Card
  },
  mounted() {
    this.$http.get('/pay/isPay.do', {
      dealId: this.dealId
    }).then(paid => {
      this.paySuccess = true
      if (paid) {
        popup.alert('支付成功，正在跳转', {
          callback: () => {
            // this.$router.replace(`/order/${this.dealId}?out_trade_no=${this.dealId}`)
          }
        })
      } else {
        popup.alert('订单未成功支付，跳转到支付页面', {
          callback: () => {
            this.$router.replace(`/pay/${this.dealId}`)
          }
        })
      }
    })
  },
  methods: {
    toHome() {
      this.$router.push('/')
    },
    toOrder() {
      this.$router.push(`/order/${this.dealId}`)
    }
  },
  data() {
    return {
      title: '确认支付结果...',
      paySuccess: false,
      serverData: {

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
</style>

