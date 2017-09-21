<template>
  <div class="slider-box text-center" ref="sliderBox">
    <ul class="slider" :style="{width: boxWidth + 'px'}">
      <li v-for="(item, i) in dataList" :key="item[idkey]" class="slider-item text-center text-overflow" :class="{selected: item[idkey] == innerValue}" @click="toSelect(item[idkey])">
        <img v-if="type == 'item'" :src="`${CDN_STATIC_HOST}/themes/mobile/blue/images/xicon_${item[idkey]}.png`"> {{item[label]}}
        <div class="bd-bt"></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array
    },
    idkey: {
      type: String,
      default: 'id'
    },
    label: {
      type: String,
      default: 'name'
    },
    type: {
      type: String,
      required: true
    },
    value: null
  },
  computed: {
    boxWidth() {
      if (this.dataList == null) {
        return 0
      }
      return this.dataList.length * 80
    }
  },
  methods: {
    toSelect(id) {
      this.innerValue = id
    }
  },
  watch: {
    dataList(val, oldVal) {
      if (val == null || val.length === 0) {
        return
      }
      if (this.innerValue) {
        if (val.some(item => {
          return item[this.idkey] != null
        })) {
          return
        }
      }
      this.innerValue = this.innerValue || val[0][this.idkey]
    },
    innerValue(val, oldVal) {
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
.slider-box {
  overflow-x: auto;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  ul.slider {
    display: inline-block;
    margin: 0;
    padding: 0;
    overflow: hidden;
    list-style-type: none;
    height: 40px;
    line-height: 40px;
    li.slider-item {
      float: left;
      min-width: 80px;
      background-color: #f8f8f8;
      line-height: 40px;
      position: relative;
      img {
        width: 16px;
        height: auto;
        vertical-align: middle;
      }
      .bd-bt {
        width: 100%;
        height: 2px;
        background-color: transparent;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        transition: background-color 0.2s;
      }
    }
    li.slider-item.selected {
      background-color: #f1f1f1;
      .bd-bt {
        background-color: #20a0ff;
      }
    }
  }
}
</style>
