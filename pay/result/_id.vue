<template>
  <section class="container text-center">
    请稍后...
    <section v-if="paid">
    <!-- <section class="operation"> -->
      <el-button type="primary" @click="toHome">回到首页</el-button>
      <el-button type="primary" @click="toOrder">查看订单</el-button>
    </section>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import popup from '../../../components/popup'
import { Button } from 'element-ui'
import bdStyleMixin from '../../vue-features/mixins/body-style'

Vue.component(Button.name, Button)

export default {
  head() {
    return {
      title: this.title
    }
  },
  mixins: [bdStyleMixin],
  mounted() {
    this.$http.get('/pay/isPay.do', {
      dealId: this.dealId
    }).then(paid => {
      if (paid) {
        this.paid = true
        this.$http.get('/pay/detail.do', {
          dealId: this.dealId
        }).then(data => {
          _.assign(this.serverData, data || {})
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
      serverData: {

      },
      paid: false,
      dealId: this.$route.params['id']
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 15%;

  .operation {
    padding: 15px 0;
  }
}
</style>

