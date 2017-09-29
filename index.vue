<template>
  <section class="container">
  </section>
</template>

<script>
export default {
  mounted() {
    this.$http.get('/querySrvInfo.do').then(data => {
      data = data || {}
      this.$webStore.session.put(this.$webStoreKey.srvInfo, {
        onlyInWechat: data.inWechat,
        serverId: data.srvId,
        defaultPageId: data.srvPageId,
        specialPageIds: data.srvSpecialPageId || []
      })
    })
  },
  data() {
    return {
      loading: true
    }
  }
}
</script>



