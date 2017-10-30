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
        <mt-loadmore v-if="list && list.length" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
          <nuxt-link v-for="pic in list" to="/event/album/123/123" :key="pic">
            <div class="pic-item">
              <img src="https://imgsa.baidu.com/news/q%3D100/sign=82cb3f9f5a3d269728d30c5d65fbb24f/11385343fbf2b211b134871bc18065380cd78e48.jpg">
            </div>
          </nuxt-link>
        </mt-loadmore>
      </div>
      <div v-if="list == null || list.length === 0" class="pic-emptry text-center">
        暂无图片
      </div>
    </Card>
  </section>
</template>

<script>
import _ from 'lodash'
import bdStyleMixin from '../../../vue-features/mixins/body-style'
import Card from '../../../vue-features/components/Card'
export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: '活动相册'
    }
  },
  mixins: [bdStyleMixin],
  mounted() {
    this.loadBottom()
  },
  components: {
    Card
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
    }
  },
  methods: {
    toUpload() {
      this.$router.push(`/event/album/${this.pubActivityId}/upload`)
    },
    loadBottom() {
      if (this.allLoaded) {
        return
      }
      this.$http
        .get('/pubActivity/queryPicList.do', {
          page: this.serverData.page + 1,
          pageSize: this.pageSize,
          pubActivityId: this.pubActivityId
        })
        .then(data => {
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
    }
  },
  data() {
    return {
      allLoaded: false,
      list: [],
      pageSize: 4,
      serverData: {
        page: 0,
        total: 0
      },
      pubActivityId: this.$route.params['id']
    }
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
</style>

