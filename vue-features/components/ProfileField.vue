<template>
  <el-row class="nav-menu">
    <nuxt-link :to="linkTo || 'javascript:;'">
      <el-col :span="forNave ? 20 : 8" class="nav-menu-col nav-menu-title text-overflow">
        <slot></slot>
      </el-col>
      <el-col :span="forNave ? 4 : 16" class="nav-menu-col text-right">
        <slot name="value">
          <template v-if="forNave">
            <i class="el-icon-arrow-right" aria-hidden="true"></i>
          </template>
        </slot>
      </el-col>
    </nuxt-link>
  </el-row>
</template>

<script>
import Vue from 'vue'
import { Row, Col } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)

export default {
  props: {
    linkTo: String,
    forNave: Boolean
  }
}
</script>


<style lang="scss" scoped>
.nav-menu {
  .nav-menu-col {
    &.nav-menu-title {
      color: #999;
    }
  }
}
</style>
