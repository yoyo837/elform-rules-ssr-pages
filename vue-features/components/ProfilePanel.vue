<template>
  <Card class="profile-panel-card" :class="{'profile-panel-protruding':protruding}">
    <div class="profile-panel text-center">
      <div class="profile-header">
        <img :src.sync="imgUrl" class="header-logo" @click="onImgClick">
      </div>
      <div class="profile-name" v-if="$slots.default">
        <slot>&nbsp;</slot>
      </div>
      <el-row v-if="showSlotForSub" class="profile-sub">
        <el-col :span="12">
          <slot name="left">&nbsp;</slot>
        </el-col>
        <el-col :span="12">
          <slot name="right">&nbsp;</slot>
        </el-col>
      </el-row>
      <slot name="built-in"></slot>
    </div>
  </Card>
</template>

<script>
import Vue from 'vue'
import utils from '../../../components/utils'
import upload from '../../../components/upload'
import Card from '../components/Card'
import { Row, Col } from 'element-ui'
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
export default {
  components: {
    Card
  },
  mounted() {
    this.showSlotForSub =
      Object.keys(this.$slots).filter(item => {
        return !['default', 'built-in'].includes(item)
      }).length > 0
  },
  props: {
    picPath: {
      type: String,
      default: utils.DEFAULT_USER_AVATAR_PIC_PATH
    },
    pubAccountId: Number,
    picType: Number,
    type: {
      type: String,
      default: 'user'
    },
    protruding: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onImgClick() {
      if (this._events.afterUpload) {
        if (this.pubAccountId && this.picType) {
          upload.avatarUpload(this.pubAccountId, this.picType).then(data => {
            this._events.afterUpload.forEach(fn => {
              fn.call(this, data)
            })
            this.timestamp = Date.now()
          })
        }
      }
    }
  },
  data() {
    return {
      imgUrl:
        this.type === 'team'
          ? utils.DEFAULT_TEAM_AVATAR_PIC_FULLPATH
          : `${utils.DEFAULT_USER_AVATAR_PIC_PATH}100X100.jpg`,
      showSlotForSub: false, // 附属内容slot显示
      timestamp: null
    }
  },
  watch: {
    picPath(val, oldVal) {
      this.imgUrl = `${val || utils.DEFAULT_USER_AVATAR_PIC_PATH}100X100.jpg?_t=${this.timestamp || ''}`
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-panel-card {
  .profile-panel {
    position: relative;
    .profile-name {
      color: #222;
      font-size: 18px;
    }
    .profile-header {
      .header-logo {
        max-width: 40%;
        min-width: 100px;
        min-height: 100px;
        border-radius: 50%;
        border: 5px solid white;
      }
    }
    .profile-sub {
      .el-col {
        padding: 5px 0;
        line-height: 30px;
      }
    }
  }

  &.profile-panel-protruding {
    margin-top: 100px;
    overflow: visible;
    .profile-panel {
      margin-top: 50px;
      .profile-header {
        position: absolute;
        width: 100%;
        top: -120px;
      }
    }
  }
}
</style>

