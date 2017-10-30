<template>
  <Card class="profile-panel-card" :class="{'profile-panel-protruding':protruding}">
    <div class="profile-panel text-center">
      <div class="profile-header">
        <img :src.sync="imgUrl" class="header-logo" @click="onImgClick">
      </div>
      <div class="profile-name" v-if="$slots.default">
        <slot>&nbsp;</slot>
      </div>
      <el-row class="profile-sub">
        <el-col :span="12">
          <slot name="left"></slot>
        </el-col>
        <el-col :span="12">
          <slot name="right"></slot>
        </el-col>
      </el-row>
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
  props: {
    picPath: {
      type: [String, Number],
      default: utils.DEFAULT_USER_AVATAR_PIC_PATH
    },
    type: {
      type: String,
      default: 'user'
    },
    protruding: {
      // 头像往上突出
      type: Boolean,
      default: true
    }
  },
  methods: {
    onImgClick() {
      if (this._events.afterUpload) {
        upload.avatarUpload().then(data => {
          this._events.afterUpload.forEach(fn => {
            fn.call(this, data)
          })
          this.timestamp = Date.now()
        })
      }
    }
  },
  data() {
    return {
      imgUrl:
        this.type === 'team'
          ? utils.DEFAULT_TEAM_AVATAR_PIC_FULLPATH
          : `${utils.DEFAULT_USER_AVATAR_PIC_PATH}100X100.jpg`,
      timestamp: null
    }
  },
  watch: {
    picPath(val, oldVal) {
      if (this.type === 'team') {
        if (val == null) {
          this.imgUrl = utils.DEFAULT_TEAM_AVATAR_PIC_FULLPATH
        } else {
          this.imgUrl = `${utils.CDN_STATIC_HOST}/themes/mobile/blue/images/xicon_${val}.png` // picPath是专业id
        }
        return
      }
      this.imgUrl = `${val || `${utils.DEFAULT_USER_AVATAR_PIC_PATH}100X100.jpg`}?_t=${this.timestamp || ''}`
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

