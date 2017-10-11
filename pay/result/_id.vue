<template>
  <section class="container text-center">
    请稍后...
  </section>
</template>

<script>
import popup from '../../../components/popup'

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: this.title
    }
  },
  mounted() {
    this.$http.get('/pay/isPay.do', {
      dealId: this.dealId
    }).then(paid => {
      if (paid) {
        popup.alert('支付成功，正在跳转', {
          callback: () => {
            this.$router.replace(`/order/${this.dealId}?out_trade_no=${this.dealId}`)
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

