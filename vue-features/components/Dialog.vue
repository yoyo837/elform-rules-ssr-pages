<template>
  <el-dialog :title="title" :visible.sync="dVisible" class="portal-dialog" :class="{'portal-dialog-mobile': isMbl}">
    <slot></slot>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import utils from '../../../components/utils'
import { Dialog } from 'element-ui'

Vue.component(Dialog.name, Dialog)

export default {
  props: {
    title: String,
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dVisible: {
      get() {
        return this.visible
      },
      set(val) {
        if (val) {
          return
        }
        this.$emit('onClose')
      }
    }
  },
  data() {
    return {
      isMbl: utils.isMobile()
    }
  }
}
</script>

