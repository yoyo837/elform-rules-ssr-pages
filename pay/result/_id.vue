<template>
  <section class="container text-center">
    请稍后...
  </section>
</template>

<script>
import popup from '../../../components/popup'
import utils from '../../../components/utils'

export default {
  head() {
    return {
      title: this.title
    }
  },
  mounted() {
    this.$http.get('/pay/isPay.do', {
      dealId: this.dealId
    }).then(paid => {
      alert(paid)
      if (paid) {
        popup.alert('支付成功，正在跳转', {
          callback: () => {
            const str = utils.serialize(this.$route.query)
            this.$router.replace(`/order/${this.dealId}${str ? `?${str}` : ''}`)
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

