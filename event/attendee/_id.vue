<template>
  <section class="container container-pd">
    <Card>
      <div class="attendee-title">
        灯火晚会 名单
      </div>
      <div class="attendee-desc">
        0人
      </div>
    </Card>
    <IndexList :data-list="serverData.list"></IndexList>

  </section>
</template>

<script>
import bdStyleMixin from '../../vue-features/mixins/body-style'
import IndexList from '../../vue-features/components/IndexList'
import Card from '../../vue-features/components/Card'

export default {
  head() {
    return {
      title: '我的活动'
    }
  },
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  mixins: [bdStyleMixin],
  mounted() {
    this.$http.get('/pubActivity/dealSignupInfo.do', {
    }).then(data => {})
  },
  components: {
    Card,
    IndexList
  },
  data() {
    return {
      serverData: {
        list: []
      },
      pubActivityId: this.$route.params['pubActivityId']
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .attendee-title,
  .attendee-desc {
    padding: 4px 0;
  }
  .attendee-title {
    color: #222;
    font-size: 18px;
    font-weight: bolder;
  }
}
</style>


