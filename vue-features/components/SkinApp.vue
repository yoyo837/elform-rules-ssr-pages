<template>
  <div id="skin-app">
    <slot>
    </slot>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'skinApp'
}
</script>

<style lang="scss">
@media (min-width:768px) {
  .has-fixed-nav-header {
    padding-top: 0;
  }
  #app {
    margin-top: 0;
    header {
      display: none;
    }
  }
}
</style>
