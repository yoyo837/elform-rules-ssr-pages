<template>
  <section class="container">
  </section>
</template>

<script>
export default {
  mounted() {
    this.$http.get('/querySrvInfo.do').then(data => {

    })
  },
  data() {
    return {
      loading: true
    }
  }
}
</script>



