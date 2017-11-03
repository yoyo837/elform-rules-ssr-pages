<template>
  <section class="container container-pd">
    <Card>
      <div class="pic-upload text-center">
        <div class="pic-upload-emit" @click="toUpload">
          <div class="camera-wrapper">
            <i class="fa fa-camera" aria-hidden="true"></i>
          </div>
          <div>
            点击上传
          </div>
        </div>
        <div class="pic-upload-desc">
          上传图片大小不能超过2M
        </div>
      </div>
      <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight}">
        <mt-loadmore v-if="list && list.length" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" class="pic-list">
          <div v-for="pic in list" :key="pic.fileKey" class="pic-item" @click="onPicClick(pic)">
            <img :src="pic.url">
          </div>
        </mt-loadmore>
      </div>
      <div v-if="list == null || list.length === 0" class="pic-emptry text-center">
        暂无图片
      </div>
    </Card>

    <section v-if="previewPic" class="pic-preview" :class="{'pic-preview-edit': editMode}">
      <img :src="previewPic.url" @click="onPreviewPicClick" ref="previewPic" :style="{transform: `rotate(${this.editData.rotate || 0}deg)`}">
      <div v-if="editMode" class="operation operation-top">
        <el-row>
          <el-col :span="12">
            <el-button type="text" class="full-width" @click="toCancelEdit">取消</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="text" class="full-width sure-btn" @click="saveEdit">确定</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="operation">
        <el-row v-if="editMode">
          <el-col :span="24">
            <el-button type="text" class="full-width" @click="toRotate">旋转</el-button>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="8">
            <el-button type="text" class="full-width" @click="toEditPic">编辑图片</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="text" class="full-width" @click="toDel">删除</el-button>
          </el-col>
          <!-- <el-col :span="6">
                                <el-button type="text" class="full-width" @click="saveImg(previewPic.url)">保存</el-button>
                              </el-col> -->
          <el-col :span="8">
            <el-button type="text" class="full-width" @click="setCover">设为封面</el-button>
          </el-col>
        </el-row>
      </div>
    </section>

  </section>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import Vue from 'vue'
import utils from '../../../../../components/utils'
import popup from '../../../../../components/popup'
import bdStyleMixin from '../../../../vue-features/mixins/body-style'
import Card from '../../../../vue-features/components/Card'
import { Row, Col, Button } from 'element-ui'
import { Loadmore } from 'mint-ui'

Vue.component(Loadmore.name, Loadmore)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.activityid)
  },
  head() {
    return {
      title: '活动相册'
    }
  },
  mixins: [bdStyleMixin],
  mounted() {
    this.loadBottom()
    if (process.browser) {
      this.mq()
    }
  },
  components: {
    Card
  },
  watch: {
    'editData.rotate'() {
      this.$nextTick().then(() => {
        const img = this.$refs['previewPic']
        if (img == null) {
          return
        }
        if (this.editData.rotate % 180 === 0) {
          img.style.height = ''
          img.style.width = ''
          img.style.marginLeft = ''
        } else {
          const szz = utils.screenSize()
          _.assign(img.style, {
            height: `${szz.width}px`,
            width: 'auto'
          })
          this.$nextTick().then(() => {
            _.assign(img.style, {
              marginLeft: `${(szz.width - img.offsetWidth) / 2}px`
            })
          })
        }
      })
    }
  },
  computed: {
    wrapperHeight() {
      if (this.list == null || this.list.length === 0) {
        return 'auto'
      }
      const wrapper = this.$refs['wrapper']
      return `${document.documentElement.clientHeight -
        wrapper.getBoundingClientRect().top -
        window.parseFloat(window.getComputedStyle(wrapper).marginTop) -
        2}px`
    },
    isReadOnly() {
      // const time = +this.now.format('x')
      return false
    }
  },
  methods: {
    mq() {
      // 刷新当前时间
      this.now = moment()
      if (this.timerSwitch) {
        setTimeout(this.mq, 1000 * 1)
      }
    },
    toEditPic() {
      this.editMode = true
    },
    toCancelEdit() {
      this.toCloseEdit()
    },
    toCloseEdit() {
      this.editMode = false
      this.setEditByDefault()
    },
    toRotate() {
      this.editData.rotate = this.editData.rotate || 0
      const onceDeg = 90
      this.editData.rotate += onceDeg
      if (this.editData.rotate === onceDeg * 4) {
        this.editData.rotate = 0
      }
    },
    saveEdit() {
      this.$http.post('/commonFile/updateStyle.do', _.assign({
        fileKey: this.previewPic.fileKey
      }, this.editData)).then(data => {
        this.toCloseEdit()
        this.exitPreview()
        this.reload()
      })
    },
    setEditByDefault() {
      this.editData = _.cloneDeep(this.defaultEditData)
    },
    saveImg(src) {
      const blob = new Blob([''], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = src
      a.download = src.replace(/(.*\/)*([^.]+.*)/gi, '$2').split('?')[0]
      const e = document.createEvent('MouseEvents')
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
      URL.revokeObjectURL(url)
    },
    onPicClick(pic) {
      if (pic) {
        this.previewPic = pic
        utils.disableBodyScroll()
      }
    },
    onPreviewPicClick() {
      this.exitPreview()
    },
    exitPreview() {
      this.previewPic = null
      utils.enableBodyScroll()
    },
    toDel() {
      this.$http.postJSON('/pubActivity/deletePic.do', {
        pubActivityId: this.pubActivityId,
        fileKeys: [this.previewPic.fileKey]
      }).then(data => {
        this.exitPreview()
        this.reload()
      })
    },
    setCover() {
      this.$http.post('/commonFile/updateConver.do', {
        fileKey: this.previewPic.fileKey
      }).then(data => {
        popup.alert('设置成功')
      })
    },
    toUpload() {
      this.$router.push(`/event/activity/${this.pubActivityId}/album/upload`)
    },
    loadBottom() {
      if (this.allLoaded) {
        return
      }
      this.$http.get('/pubActivity/queryPicList.do', {
        page: this.serverData.page + 1,
        pageSize: this.pageSize,
        pubActivityId: this.pubActivityId
      }).then(data => {
        _.assign(this.serverData, {
          page: data.page,
          total: data.total
        })
        const oldLength = this.list.length
        this.list.push.apply(
          this.list,
          (data.rows || []).map(item => {
            // 处理一下字段再给到vm
            item.deal = item.deal || {}
            item.commonPay = item.commonPay || {}
            item.commonSales = item.commonSales || {}
            return item
          })
        ) // 追加

        if (this.list.length - oldLength < this.pageSize || this.list.length >= this.serverData.total) {
          // 没用响应满页或者超过总数
          this.allLoaded = true
        }

        const loadmore = this.$refs['loadmore']
        loadmore && loadmore.onBottomLoaded()
      })
    },
    reload() {
      this.list = []
      this.allLoaded = false
      this.serverData = {
        page: 0,
        total: 0
      }
      this.loadBottom()
    }
  },
  data() {
    const defaultEditData = {
      rotate: 0
    }
    return {
      now: moment(),
      timerSwitch: true,
      previewPic: null,
      editMode: false,
      editData: _.cloneDeep(defaultEditData),
      defaultEditData: defaultEditData,
      allLoaded: false,
      list: [],
      pageSize: 30,
      serverData: {
        page: 0,
        total: 0
      },
      pubActivityId: this.$route.params['activityid']
    }
  },
  destroyed() {
    this.timerSwitch = false
  }
}
</script>

<style lang="scss" scoped>
.container {
  .pic-upload {
    border-bottom: 1px solid #f0f0f0;
    .pic-upload-emit {
      margin: 15px 0;
      width: 80px;
      height: 80px;
      display: inline-block;
      border-radius: 4px;
      border: 1px dashed #999;
      .camera-wrapper {
        position: relative;
        height: 60%;
        font-size: 30px;
        i {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }
      }
    }
    .pic-upload-desc {
      font-size: 12px;
      color: #999;
      padding: 15px 0;
    }
  }
  .pic-list {
    text-align: center;
    padding-top: 5px;
    .pic-item {
      width: 80px;
      height: 80px;
      display: inline-block;
      line-height: calc(80px - 2px - 2px); // padding 上下
      padding: 2px;
    }
    img {
      border-radius: 4px;
      width: 100%;
      height: 100%;
      vertical-align: middle;
    }
  }
  .pic-emptry {
    padding: 15px 0 20px 0;
    font-size: 12px;
    color: #999;
  }
}

.pic-preview {
  position: absolute;
  display: flex;
  align-items: center;
  height: calc(100% - 44px);
  top: 0;
  left: 0;
  right: 0;
  background-color: #f8f8f8;
  img {
    width: 100%;
  }
  .operation {
    background-color: white;
    border-top: 1px solid #f0f0f0;
    margin: 0;
    position: fixed;
    width: 100%;
    bottom: 0;
    font-size: 14px;
    .el-row {
      .el-col {
        .el-button {
          margin: 0;
          color: #666;
          height: 44px;
        }
      }
      .el-col + .el-col {
        .el-button {
          border-left: 1px solid #f0f0f0;
        }
      }
    }
  }
  .operation-top {
    bottom: auto;
    top: 0;
    .el-row {
      .el-col {
        .el-button {
          &.sure-btn {
            color: #f26a3e;
          }
        }
      }
    }
  }
}
.pic-preview-edit {
  .operation {
    background-color: #999;
    .el-row {
      .el-col {
        .el-button {
          color: white;
        }
      }
    }
  }
}
</style>

