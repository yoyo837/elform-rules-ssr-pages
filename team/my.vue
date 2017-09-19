<template>
  <section class="container">
    <ProfilePanel :pic-path="serverData.loginAccountVo.picPath">
      {{serverData.loginAccountVo.realName}}/{{serverData.loginAccountVo.mobile}}
    </ProfilePanel>
    <nuxt-link v-for="team in serverData.teamList" :key="team.id" :to="`/team/profile?teamid=${team.id}`">
      <el-row class="nav-panel">
        <el-col :span="20">
          <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/m_zh.png`">
          <span>{{team.teamName}}</span>
        </el-col>
        <el-col :span="4" class="text-right">
          <i class="el-icon-arrow-right"></i>
        </el-col>
      </el-row>
    </nuxt-link>
    <div class="fixed-bt">
      <nuxt-link to="/team/new">
        <el-button type="danger">创建团队</el-button>
      </nuxt-link>
      <nuxt-link to="/team/search">
        <el-button type="primary">查找团队</el-button>
      </nuxt-link>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import { Row, Col, Button } from 'element-ui'
import bdStyleMixin, { DefaultConfig } from '../vue-features/mixins/body-style'
import ProfilePanel from '../vue-features/components/ProfilePanel'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  name: 'team-my',
  head() {
    return {
      title: '我的团队'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    ProfilePanel
  },
  mounted() {
    this.$http.get('/team/myTeamList.do').then(data => {
      // this.serverData.teamList = data.teamList || []
      _.assign(this.serverData, data || {})
    })
  },
  data() {
    return {
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-team-my`,
      serverData: {
        loginAccountVo: {},
        teamList: []
      }
    }
  }
}
</script>

<style lang="scss">
body.bd-pt-team-my {
  padding-bottom: 100px;
}
</style>
