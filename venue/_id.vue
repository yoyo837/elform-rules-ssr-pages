<template>
  <section class="container">
    <CustMap :lng="116.397428" :lat="39.90923" name="某某场馆" address="XX省，XX市，XX区，XX街道123号"></CustMap>
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
