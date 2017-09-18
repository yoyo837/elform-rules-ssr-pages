<template>
  <section class="container">
    <ProfilePanel :pic-path="null" size="small" type="team">
    </ProfilePanel>
    <el-form ref="form" :model="serverData" :rules="rules" label-width="40px" class="ctx-bg mintui-style">
      <el-form-item label="搜索" prop="key">
        <el-input placeholder="团号/团队名称" v-model="serverData.key"></el-input>
      </el-form-item>
    </el-form>
    <div class="operation">
      <el-button type="primary" class="full-width" @click="toSearch">搜索</el-button>
    </div>
    <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
      <nuxt-link :to="`/team/profile?teamid=${item.id}`" v-for="item in list" :key="item.id">
        <el-row class="nav-panel">
          <el-col :span="18">
            <img :src="defaultTeamImg">
            <span>{{item.teamName}}</span>
          </el-col>
          <el-col :span="6" class="text-right">
            <el-button type="primary" size="small">申请加入</el-button>
          </el-col>
        </el-row>
      </nuxt-link>
    </mt-loadmore>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import utils from '../../components/utils'
import ProfilePanel from '../vue-features/components/ProfilePanel'
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
    ProfilePanel
  },
  methods: {
    toSearch() {
      this.list = []
      this.listServerData.page = 0
      this.listServerData.total = 0
      this.allLoaded = false
      this.loadBottom()
    },
    loadBottom() {
      this.$http.get('/team/searchTeamList.do', _.assign(this.serverData, {
        page: (this.listServerData.page || 0) + 1,
        pageSize: this.pageSize
      })).then(data => {
        if (_.isArray(data)) {
          data = {
            rows: data
          }
        }
        if (!_.isArray(data.rows)) {
          data.rows = []
        }
        _.assign(this.listServerData, {
          page: data.page || 1,
          total: data.total || data.rows.length
        })
        const oldLength = this.list.length
        this.list.push.apply(this.list, data.rows)

        if (this.list.length - oldLength < this.pageSize || this.list.length >= this.listServerData.total) { // 没用响应满页或者超过总数
          this.allLoaded = true
        }

        this.$refs.loadmore.onBottomLoaded()
      })
    }
  },
  data() {
    return {
      rules: {
      },
      allLoaded: false,
      list: [],
      pageSize: 10,
      listServerData: {
        page: 0,
        total: 0
      },
      serverData: {
        key: null
      },
      defaultTeamImg: utils.DEFAULT_TEAM_AVATAR_PIC_FULLPATH
    }
  }
}
</script>

<style lang="scss" scoped>
.operation {
  padding: 8px;
}

.el-form-item {
  margin: 0;
}

.el-row.nav-panel .el-col {
  img {
    border-radius: 50%;
  }
  .el-button--small {
    margin-top: 5.5px;
  }
}
</style>

