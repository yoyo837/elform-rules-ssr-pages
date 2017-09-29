<template>
  <section class="container">
  </section>
</template>

<script>
export default {
  mounted() {
    let serviceInfo = this.$webStore.session.get(this.$webStoreKey.srvInfo)
    Promise.all([serviceInfo || this.$http.get('/querySrvInfo.do')]).then(dataList => {
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
      // console.log(serviceInfo)
      // TODO something
    })
  }
}
</script>



