<template>
  <Card class="profile-panel-card">
    <div class="profile-panel text-center">
      <div class="profile-header">
        <img :src.sync="imgUrl" class="header-logo" @click="onImgClick">
      </div>
      <div class="profile-name">
        <slot>&nbsp;</slot>
      </div>
      <el-row v-if="showSlot" class="profile-sub">
        <el-col :span="12">
          <slot name="left">&nbsp;</slot>
        </el-col>
        <el-col :span="12">
          <slot name="right">&nbsp;</slot>
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
  mounted() {
    this.showSlot = Object.keys(this.$slots).length > 0
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
      imgUrl: this.type === 'team' ? utils.DEFAULT_TEAM_AVATAR_PIC_FULLPATH : `${utils.DEFAULT_USER_AVATAR_PIC_PATH}100X100.jpg`,
      showSlot: true,
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
  margin-top: 100px;
  overflow: visible;
  .profile-panel {
    position: relative;
    margin-top: 50px;
    .profile-name {
      color: #222;
      font-size: 18px;
    }
    .profile-header {
      position: absolute;
      width: 100%;
      top: -120px;
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
}
</style>

