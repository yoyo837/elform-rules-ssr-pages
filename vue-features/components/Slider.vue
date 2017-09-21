<template>
  <div class="slider-box text-center" :class="`slider-box-${type}`" ref="sliderBox">
    <ul class="slider" :style="{width: boxWidth + 'px'}">
      <li v-for="(item, i) in dataList" :key="item[idkey]" class="slider-item text-center text-overflow" :class="{selected: item[idkey] == innerValue}" @click="toSelect(item[idkey])">
        <template v-if="type == 'item'">
          <img :src="`${CDN_STATIC_HOST}/themes/mobile/blue/images/xicon_${item[idkey]}.png`"> {{item[label]}}
        </template>
        <template v-else-if="type == 'datetime'">
          <template v-if="item[label] == null || item[label2] == null">
            {{item[label] || item[label2]}}
          </template>
          <template v-else>
            <div class="dt datetime">{{item[label]}}</div>
            <div class="dt week">{{item[label2]}}</div>
          </template>
        </template>
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
    label2: {
      type: String
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
      padding: 0 5px;
      .dt {
        line-height: 20px;
        font-size: 12px;
      }
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
      color: #20a0ff;
      .bd-bt {
        background-color: #20a0ff;
      }
    }
  }
}

.slider-box-datetime {
  ul.slider {
    li.slider-item.selected {
      color: white;
      background-color: #20a0ff;
    }
  }
}
</style>
