<template>

</template>

<script>
import utils from '../../components/utils'
export default {
  name: 'page',
  mounted() {
    const query = this.$route.query || {}
    const id = query['id']
    delete query.id
    this.$router.replace(`/page/${id}?${utils.serialize(query)}`)
  }
}
</script>

<style>

</style>

