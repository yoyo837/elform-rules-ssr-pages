<template>
  <section class="container container-pd">
    <Card title-text="我的活动" title-icon="fa fa-id-card">
      <div class="text-center empty-events">
        暂无活动
      </div>
    </Card>
  </section>
</template>

<script>
import bdStyleMixin from '../vue-features/mixins/body-style'
import Card from '../vue-features/components/Card'
export default {
  mixins: [bdStyleMixin],
  components: {
    Card
  }
}
</script>

<style lang="scss" scoped>
.empty-events {
  padding: 15px 0;
  font-size: 12px;
  color: #999;
}
</style>

