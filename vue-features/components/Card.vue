<template>
  <el-card :class="{'el-card-invisible': invisible}">
    <template v-if="titleText || titleHtml || titleIcon" slot="header">
      <i v-if="titleIcon" :class="titleIcon" aria-hidden="true"></i>
      <span v-if="titleHtml" v-html="titleHtml"></span>
      <template v-else>
        {{titleText}}
      </template>
      <div class="el-card__header-desc" v-if="$slots['header-desc']">
        <slot name="header-desc"></slot>
      </div>
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
    titleIcon: String,
    titleHtml: String,
    invisible: {
      type: Boolean,
      default: false
    }
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

