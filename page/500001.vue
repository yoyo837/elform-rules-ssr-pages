<template>
  <div>
    500001
  </div>
</template>

<script>
import pageConfig from '../vue-features/page-config'
export default {
  mounted() {
    pageConfig.getPageData([{
      mapId: 102103
    }, {
      mapId: 101985
    }, {
      mapId: 101986
    }])
  }
}
</script>
