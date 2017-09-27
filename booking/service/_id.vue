<template>

</template>

<script>
import store from '../../../components/store'
export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: '选择服务人员'
    }
  },
  mounted() {
    const platformCache = store.session.get('platform_cache')
    if (platformCache == null || platformCache.length === 0) {
      this.$router.push(`/booking/schedule/${this.params.salesId}`) // 跳到选场地
      return
    }
    this.$http.postJSON('/sportPlatformUser/queryByDealPlatform.do', {
      dealPlatformList: platformCache
    }).then(data => {

    })
  },
  data() {
    return {
      salesId: this.$route.params['id']
    }
  }
}
</script>

<style>

</style>
