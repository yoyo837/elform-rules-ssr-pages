<template>
  <div>
    <div class="badge-wrapper" :class="{selected: colorItem.key === innerValue}" v-for="colorItem in data" :key="colorItem.key" @click="onSelect(colorItem)">
      <mt-badge size="small" :color="colorItem.rgb" :style="{color:blackOrWhite(colorItem.rgb)}">{{colorItem.title}}</mt-badge>
      <i class="el-icon-check" :style="{color:blackOrWhite(colorItem.rgb)}"></i>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import color from '../../../components/color'
import { Badge } from 'mint-ui'

Vue.component(Badge.name, Badge)

export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    value: null
  },
  methods: {
    blackOrWhite: color.blackOrWhite,
    onSelect(colorItem) {
      this.innerValue = colorItem.key
      this.$emit('input', this.innerValue)
    }
  },
  data() {
    return {
      innerValue: this.value
    }
  }
}
</script>

<style lang="scss" scoped>
.badge-wrapper {
  display: inline-block;
  position: relative;
  .mint-badge {
    margin: 0 5px 5px 0;
  }
  i {
    display: none;
    position: absolute;
    right: 0;
    top: 0;
  }
  &.selected {
    .mint-badge {
      margin: 0 5px 5px 0;
    }
    i {
      display: inline-block;
    }
  }
}
</style>


