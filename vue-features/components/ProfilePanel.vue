<template>
  <el-row class="header-panel text-center" :class="classObject" :style="{backgroundColor: color, color: contrast}">
    <el-col :span="24">
      <img :src.sync="imgUrl" class="header-logo">
    </el-col>
    <el-col :span="6" class="text-left" v-if="showSlot">
      <slot name="left">&nbsp;</slot>
    </el-col>
    <el-col :span="12" v-if="showSlot">
      <slot>&nbsp;</slot>
    </el-col>
    <el-col :span="6" class="text-right" v-if="showSlot">
      <slot name="right">&nbsp;</slot>
    </el-col>
  </el-row>
</template>

<script>
// import _ from 'lodash'
import Vue from 'vue'
import utils from '../../../components/utils'
import color from '../../../components/color'
import { Row, Col } from 'element-ui'
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
export default {
  name: 'profilePanel',
  mounted() {
    this.showSlot = Object.keys(this.$slots).length > 0
  },
  props: {
    picPath: {
      type: String,
      default: utils.DEFAULT_USER_AVATAR_PIC_PATH
    },
    size: {
      type: String,
      default: 'normal'
    },
    type: {
      type: String,
      default: 'user'
    }
  },
  data() {
    return {
      imgUrl: this.type === 'team' ? utils.DEFAULT_TEAM_AVATAR_PIC_FULLPATH : `${utils.DEFAULT_USER_AVATAR_PIC_PATH}100X100.jpg`,
      color: ({
        user: 'rgba(32, 160, 255, 0.75)',
        team: 'rgba(32, 160, 255, 0.75)'
        // team: '#1cc2b4'
      })[this.type],
      showSlot: true
    }
  },
  computed: {
    classObject() {
      return {
        [`panel-size-${this.size}`]: true
      }
    },
    contrast() {
      return color.blackOrWhite(this.color)
    }
  },
  watch: {
    picPath(val, oldVal) {
      this.imgUrl = `${(val || utils.DEFAULT_USER_AVATAR_PIC_PATH)}100X100.jpg`
    }
  }
}
</script>

<style lang="scss" scoped>
.header-panel {
  padding: 8px;
  color: white;
  .el-col {
    .header-logo {
      max-width: 40%;
      min-width: 100px;
      min-height: 100px;
      border-radius: 50%;
      border: 5px solid rgba(0, 0, 0, 0.1);
    }
  }
}

.header-panel.panel-size-small {
  .el-col {
    .header-logo {
      max-width: 20%;
      min-width: 50px;
      min-height: 50px;
    }
  }
}
</style>

