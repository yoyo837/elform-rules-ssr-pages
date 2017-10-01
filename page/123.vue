<template>
  <div>
    123
  </div>
</template>

<script>
import pageConfig from '../vue-features/page-config'
export default {
  mounted() {
    pageConfig.getPageData([{
      mapId: 102931
    }]).then(data => {
      console.log(data)
    })
  }
}
</script>

