<template>
  <section class="container container-pd">
    <Card title-text="我的团队" title-icon="fa fa-id-card">
      <ProfilePanel :pic-path="serverData.loginAccountVo.picPath" :protruding="false">
        {{serverData.loginAccountVo.realName}}/{{serverData.loginAccountVo.mobile}}
      </ProfilePanel>
    </Card>
    <section class="operation">
      <el-row :gutter="5">
        <el-col :span="12">
          <nuxt-link to="/team/new">
            <el-button type="primary" class="full-width shadow-button">创建团队</el-button>
          </nuxt-link>
        </el-col>
        <el-col :span="12">
          <nuxt-link to="/team/search">
            <el-button type="primary" class="full-width shadow-button">查找团队</el-button>
          </nuxt-link>
        </el-col>
      </el-row>
    </section>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import utils from '../../components/utils'
import { Row, Col, Button } from 'element-ui'
import bdStyleMixin from '../vue-features/mixins/body-style'
import ProfilePanel from '../vue-features/components/ProfilePanel'
import Card from '../vue-features/components/Card'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  head() {
    return {
      title: '我的团队'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    ProfilePanel,
    Card
  },
  mounted() {
    this.$http.get('/team/myTeamList.do').then(data => {
      // this.serverData.teamList = data.teamList || []
      _.assign(this.serverData, data || {})
    })
  },
  data() {
    return {
      defaultTeamImg: utils.DEFAULT_TEAM_AVATAR_PIC_FULLPATH,
      serverData: {
        loginAccountVo: {},
        teamList: []
      }
    }
  }
}
</script>

