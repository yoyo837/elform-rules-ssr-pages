<template>
  <section class="container container-pd">
    <Card title-text="我的活动" title-icon="icon-pt-event">
      <div v-if="list == null || list.length === 0" class="text-center empty-events">
        暂无活动
      </div>
      <mt-loadmore v-else :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
        <div v-for="item in list" :key="item.exerciseId" class="event-item">
          <div class="event-content">
            <img :src="`${item.picUrl[0] || `${CDN_IMG_HOST}/exerciselist/0/195X125.jpg`}`" @click="toDetailPage(item.exerciseId)">
            <div class="event-content__desc">
              <div class="event-content__desc-body">
                <div class="event-content__desc-title">{{item.exerciseName}}</div>
                <div class="event-content__desc-time">{{formatDate(item.exerciseStartDate)}}至{{formatDate(item.exerciseEndDate)}}</div>
              </div>
            </div>
          </div>
          <el-row class="event-operation">
            <el-col :span="12">
              <nuxt-link :to="`/event/activity/${item.pubActivityId}/attendee`">
                <el-button type="text" class="full-width">查看名单</el-button>
              </nuxt-link>
            </el-col>
            <el-col :span="12">
              <nuxt-link :to="`/event/activity/${item.pubActivityId}/album`">
                <el-button type="text" class="full-width">活动相册</el-button>
              </nuxt-link>
            </el-col>
          </el-row>
        </div>
      </mt-loadmore>
    </Card>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import bdStyleMixin from '../vue-features/mixins/body-style'
import Card from '../vue-features/components/Card'
import { Row, Col, Button } from 'element-ui'
import { Loadmore } from 'mint-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(Loadmore.name, Loadmore)

export default {
  head() {
    return {
      title: '我的活动'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    Card
  },
  mounted() {
    this.loadBottom()
  },
  methods: {
    toDetailPage(dataId) {
      this.$router.push(`/event/${dataId}`)
    },
    loadBottom() {
      if (this.allLoaded) {
        return
      }
      this.$http
        .get('/pubActivity/list.do', {
          page: this.serverData.page + 1,
          pageSize: this.pageSize
        })
        .then(data => {
          _.assign(this.serverData, {
            page: data.page,
            total: data.total
          })
          const oldLength = this.list.length
          this.list.push.apply(this.list, data.rows || []) // 追加
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
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .empty-events {
    padding: 15px 0;
    font-size: 12px;
    color: #999;
  }
  .event-item {
    padding: 5px 0;
    .event-content {
      position: relative;
      padding: 8px 8px 0 8px;
      img {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
      .event-content__desc {
        position: absolute;
        width: 100%;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0 8px; // 8 x 2
        color: white;
        .event-content__desc-body {
          background-color: rgba(0, 0, 0, 0.35);
          padding: 4px 8px;
          .event-content__desc-title {
            font-size: 18px;
          }
        }
      }
    }
    .el-row.event-operation {
      padding: 0 8px;
      .el-col {
        background-color: #f8f8f8;
        .el-button {
          margin-bottom: 0;
          color: #666;
          border-radius: 0;
        }
      }
      .el-col + .el-col {
        .el-button {
          border-left: 1px solid #f0f0f0;
        }
      }
    }
  }
  .event-item +.event-item {
    border-top: 1px solid #f0f0f0;
  }
}
</style>

