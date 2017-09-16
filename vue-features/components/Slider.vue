<template lang="pug">
  .slider-box(class="text-center", ref="sliderBox")
    ul.slider(:style="{width: boxWidth + 'px'}")
      li.slider-item(class="text-center text-overflow", :class="{selected: item.id == selectId}", v-for="(item, i) in dataList", @click="toSelect(item.id)")
        i.el-icon-setting
        |{{item.name}}
        .bd-bt
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      required: true,
      validator: function(list) {
        return list && list.length
      }
    },
    defaultId: {
      type: Number
    }
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
      this.selectId = id
      this.$emit('change', id)
      // const elem = e.currentTarget
    }
  },
  data() {
    return {
      selectId: this.defaultId
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
      width: 80px;
      background-color: #f8f8f8;
      line-height: 40px;
      position: relative;
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
