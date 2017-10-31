<template>
  <section class="container container-pd">
    <Card :mini="true">
      <el-form ref="form" :model="serverData" :rules="rules" label-width="50px">
        <el-form-item label="搜索" prop="key" class="search-item">
          <el-input placeholder="团号/团队名称" v-model="serverData.key"></el-input>
        </el-form-item>
      </el-form>
    </Card>
    <div class="operation">
      <el-button type="primary" class="full-width shadow-button" @click="toSearch">搜索</el-button>
    </div>
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight}">
      <mt-loadmore :bottom-method="load" :bottom-all-loaded="allLoaded" ref="loadmore">
        <Card :mini="true">
          <el-row class="team-item" v-for="item in list" :key="item.id">
            <nuxt-link :to="`/team/${item.id}`">
              <el-col :span="18">
                <img :src="`${CDN_STATIC_HOST}/themes/mobile/blue/images/xicon_${item.professionalId}.png`">
                <div class="team-desc">
                  <div class="team-desc__title text-overflow">{{item.teamName}}</div>
                  <div class="team-desc__sub text-overflow">团号:{{item.id}} 创建人{{item.createRealName}}</div>
                </div>
              </el-col>
              <el-col :span="6" class="text-right">
                <template v-if="item.roleIsTeamMember">
                </template>
                <el-button v-else type="text">申请加入</el-button>
              </el-col>
            </nuxt-link>
          </el-row>
        </Card>
      </mt-loadmore>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import Card from '../vue-features/components/Card'
import bdStyleMixin from '../vue-features/mixins/body-style'
import { Form, FormItem, Button, Input, Row, Col } from 'element-ui'
import { Loadmore } from 'mint-ui'

Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Loadmore.name, Loadmore)

export default {
  mixins: [bdStyleMixin],
  components: {
    Card
  },
  methods: {
    toSearch() {
      this.list = []
      this.listServerData.page = 0
      this.listServerData.total = 0
      this.allLoaded = false
      this.load()
    },
    load() {
      this.$http
        .get(
          '/team/searchTeamList.do',
          _.assign(this.serverData, {
            page: (this.listServerData.page || 0) + 1,
            pageSize: this.pageSize
          })
        )
        .then(data => {
          if (_.isArray(data)) {
            data = {
              rows: data
            }
          }
          if (!_.isArray(data.rows)) {
            data.rows = []
          }

          const oldLength = this.list.length
          if (data.rows.length) {
            _.assign(this.listServerData, {
              page: data.page || 1,
              total: data.total || data.rows.length
            })

            /* eslint-disable no-useless-call */
            this.list.splice.apply(this.list, [0, 0, ...data.rows])
          }
          if (this.list.length - oldLength < this.pageSize || this.list.length >= this.listServerData.total) {
            // 没用响应满页或者超过总数
            this.allLoaded = true
          }
          this.$refs.loadmore.onBottomLoaded()
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
    }
  },
  data() {
    return {
      rules: {},
      allLoaded: false,
      list: [],
      pageSize: 10,
      listServerData: {
        page: 0,
        total: 0
      },
      serverData: {
        key: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.operation {
  margin-top: 10px;
  .el-button {
    margin-bottom: 0;
  }
}

.page-loadmore-wrapper {
  margin-top: 10px;
}

.el-form-item {
  margin: 0;
  .el-form-item__label {
    text-align: center;
    padding-right: 0;
  }
}

.team-item {
  height: 80px;
  padding: 10px 15px;
  img {
    height: 32px;
    width: 32px;
    margin-top: 14px;
    vertical-align: top;
  }
  .team-desc {
    display: inline-block;
    padding-left: 10px;
    .team-desc__title {
      color: #222;
      line-height: 35px;
    }
    .team-desc__sub {
      line-height: 25px;
      font-size: 12px;
      color: #999;
    }
  }
  .el-button {
    height: 60px;
  }
}

.team-item + .team-item {
  border-top: 1px solid #f0f0f0;
}

.inner-row {
  height: 50%;
  width: 100%;
}
</style>

