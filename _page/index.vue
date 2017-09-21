<template>

</template>

<script>
import utils from '../../components/utils'
export default {
  name: 'page',
  validate({ params, query }) {
    return /^\d+$/.test(query.id)
  },
  created() {
    const query = this.$route.query || {}
    const id = query['id']
    delete query.id
    this.$router.replace(`/page/${id}?${utils.serialize(query)}`)
  }
}
</script>

