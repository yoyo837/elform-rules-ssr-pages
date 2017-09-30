<template>
  <section class="container">
  </section>
</template>

<script>
import utils from '../components/utils'
export default {
  async mounted() {
    let serviceInfo = this.$webStore.session.get(this.$webStoreKey.srvInfo)
    await Promise.all([serviceInfo || this.$http.get('/querySrvInfo.do')]).then(dataList => {
      if (serviceInfo == null) {
        const data = dataList[0] || {}
        serviceInfo = {
          onlyInWechat: data.inWechat,
          serviceId: data.srvId,
          defaultPageId: data.srvPageId,
          specialPageIds: data.srvSpecialPageId || []
        }
        this.$webStore.session.put(this.$webStoreKey.srvInfo, serviceInfo)
      }
    })
    const query = this.$route.query || {}
    query.id = serviceInfo.defaultPageId
    this.$router.replace(`/page?${utils.serialize(query)}`)
  }
}
</script>



