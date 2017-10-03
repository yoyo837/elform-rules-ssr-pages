<template>
  <div>
    支付结果返回页</div>
</template>

<script>
// import _ from 'lodash'
import bdStyleMixin from '../../vue-features/mixins/body-style'
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
    }).then(data => {
      if (data) {

      }
      // _.assign(this.serverData, data || {})
    })
    // this.$http.get('/pay/detail.do', {
    //   dealId: this.dealId
    // }).then(data => {
    //   _.assign(this.serverData, data || {})
    // })
  },
  data() {
    return {
      title: '确认支付结果...',
      serverData: {

      },
      // paid: false,
      dealId: this.$route.params['id']
    }
  }
}
</script>

<style>

</style>
