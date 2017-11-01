<template>
  <section class="container text-center">
    请稍后...
  </section>
</template>

<script>
export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: '跳转中...'
    }
  },
  mounted() {
    location.href = `/page.shtml?id=101418&dataType=94&dataId=${this.$route.params['id']}`
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 15%;
}
</style>

