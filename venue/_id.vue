<template>
  <section class="container">
    <CustMap :lng="116.397428" :lat="39.90923" name="某某场馆" address="XX省，XX市，XX区，XX街道123号"></CustMap>
  </section>
</template>

<script>
import _ from 'lodash'
import CustMap from '../vue-features/components/Map'
export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  components: {
    CustMap
  },
  mounted() {
    this.$http.get('/commonSales/queryDetail.do', {
      salesId: this.salesId
    }).then(data => {
      data = data || {}
      _.assign(this.serverData, data)
      // 稿子出来了，先去刷UI了
    })
  },
  data() {
    return {
      serverData: {
        amapLocation: null,
        commonSales: {},
        detail: null,
        picList: []
      },
      salesId: this.$route.params['id']
    }
  }
}
</script>
