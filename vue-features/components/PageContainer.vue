<template>
  <section class="container" :class="{'has-fixed-nav-header': navHeader}">
    <mt-header fixed v-if="navHeader">
      <nuxt-link :to="navHeaderBackPath" v-if="navHeaderBackPath != null" slot="left">
        <mt-button icon="back"></mt-button>
      </nuxt-link>
    </mt-header>
    <slot></slot>
  </section>
</template>

<script>
import Vue from 'vue'
import { Header, Button } from 'mint-ui'
Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
export default {
  name: 'pageContainer',
  props: {
    navHeader: {
      type: Boolean,
      default: false
    },
    navHeaderBackPath: {
      type: String,
      default: '/'
    }
  }
}
</script>
