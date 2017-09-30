<template>

</template>

<script>
import utils from '../../components/utils'
export default {
  name: 'page',
  validate({ params, query }) {
    return /^\d+$/.test(query.id)
  },
  mounted() {
    const query = this.$route.query || {}
    const id = query['id']
    delete query.id
    this.$router.replace(`/page/${id}${Object.keys(query).length > 0 ? '?' : ''}${utils.serialize(query)}`)
  }
}
</script>

