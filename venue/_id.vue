<template>
  <section class="container">
    <CustMap></CustMap>
  </section>
</template>

<script>
import CustMap from '../vue-features/components/Map'
export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  components: {
    CustMap
  }
}
</script>
