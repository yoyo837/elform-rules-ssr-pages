<template>
  <el-card>
    <template v-if="titleText || titleIcon" slot="header">
      <i v-if="titleIcon" :class="titleIcon" aria-hidden="true"></i>
      {{titleText}}
    </template>
    <slot></slot>
  </el-card>
</template>

<script>
import Vue from 'vue'
import { Card } from 'element-ui'
Vue.component(Card.name, Card)

export default {
  props: {
    titleText: String,
    titleIcon: String
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  .el-card__header {
    i {
      color: #666;
    }
  }
}
</style>

