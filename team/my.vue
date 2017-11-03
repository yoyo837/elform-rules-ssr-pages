<template>
  <section class="container container-pd">
    <Card title-text="我的团队" title-icon="icon-pt-team">
      <ProfilePanel :pic-path="serverData.loginAccountVo.avatar">
        {{serverData.loginAccountVo.realName}}/{{serverData.loginAccountVo.mobile}}
      </ProfilePanel>
      <div v-if="serverData.teamList && serverData.teamList.length" class="team-list">
        <ProfileField v-for="item in serverData.teamList" :key="item.id" :to="`/team/${item.id}`" :for-nav="true">
          <img :src="`${CDN_STATIC_HOST}/themes/mobile/blue/images/xicon_${item.professionalId}.png`">
          <span>{{item.teamName}}</span>
        </ProfileField>
      </div>
      <div v-else class="team-list empty-list text-center">
        暂无信息
      </div>
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
import ProfileField from '../vue-features/components/ProfileField'
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
    Card,
    ProfileField
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

<style lang="scss" scoped>
.container {
  .team-list {
    border-top: 1px solid #f0f0f0;
  }
  .empty-list {
    padding: 15px 0;
    font-size: 12px;
    color: #999;
  }
}
</style>

