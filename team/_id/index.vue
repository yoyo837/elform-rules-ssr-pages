<template>
  <section class="container container-pd">
    <Card>
      <ProfilePanel :pic-path="serverData.teamInfo.professionalId" type="team">
        <template slot="left">团号：{{serverData.teamInfo.id}}</template>
        <!-- <template>{{serverData.teamInfo.teamName || '&nbsp;'}}</template> -->
        <template slot="right">人数：{{serverData.memberCount}}</template>
      </ProfilePanel>
      <nuxt-link :to="`/team/${teamid}/members`">
        <el-button type="primary" size="mini" class="el-button--ellipse member-list-btn">成员列表</el-button>
      </nuxt-link>
      <ProfileField>
        创建人：
        <template slot="value">{{serverData.teamInfo.createRealName}}</template>
      </ProfileField>
      <ProfileField>
        团队名称：
        <template slot="value">{{serverData.teamInfo.teamName}}</template>
      </ProfileField>
      <ProfileField>
        成立时间：
        <template slot="value">{{serverData.teamInfo.teamCreateDateValue}}</template>
      </ProfileField>
      <ProfileField>
        所属分类：
        <template slot="value">{{serverData.teamInfo.professionalIdValue}}</template>
      </ProfileField>
      <ProfileField>
        联系方式：
        <template slot="value">{{serverData.teamInfo.contact}}</template>
      </ProfileField>
      <ProfileField>
        选择地区：
        <template slot="value"></template>
      </ProfileField>
      <ProfileField>
        详细地址：
        <template slot="value">{{serverData.teamInfo.address}}</template>
      </ProfileField>
      <ProfileField>
        所属行业：
        <template slot="value">{{serverData.teamInfo.industryIdValue}}</template>
      </ProfileField>

      <ProfileField v-for="field in serverData.extFieldList" :key="field.dataId">
        {{field.extShowName}}：
        <template slot="value">{{field.dataShowValue}}</template>
      </ProfileField>
    </Card>

    <section class="operation">
      <template v-if="serverData.roleIsTeamAdmin">
        <el-button type="primary" class="full-width shadow-button" @click="toEdit">修改团队信息</el-button>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-button class="el-button--white full-width shadow-button" @click="toDisband">解散团队</el-button>
          </el-col>
          <el-col :span="12">
            <el-button class="el-button--white full-width shadow-button" @click="toShareGuide">邀请加入</el-button>
          </el-col>
        </el-row>
      </template>
      <template v-else-if="serverData.roleIsTeamMember">
        <el-button type="primary" class="full-width shadow-button" @click="toQuit">退出团队</el-button>
      </template>
      <template v-else>
        <el-button type="primary" class="full-width shadow-button" @click="toJoin">申请加入</el-button>
      </template>
    </section>

    <div class="share-fenx" @click="closeShare" v-show="showShareImg">
      <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/fenx.png`">
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import utils from '../../../components/utils'
import popup from '../../../components/popup'
import ProfilePanel from '../../vue-features/components/ProfilePanel'
import Card from '../../vue-features/components/Card'
import bdStyleMixin from '../../vue-features/mixins/body-style'
import ProfileField from '../../vue-features/components/ProfileField'
import { Row, Col, Button } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: `团队-${this.serverData.teamInfo.teamName || ''}`
    }
  },
  mixins: [bdStyleMixin],
  components: {
    ProfilePanel,
    Card,
    ProfileField
  },
  mounted() {
    this.$http.get('/team/teamInfo.do', {
      teamId: this.teamid
    }).then(data => {
      data = data || {}
      data.teamInfo = data.teamInfo || {}

      // data.extFieldList = (data.extFieldList || []).map(field => {

      // })
      _.assign(this.serverData, data)
      this.$nextTick().then(() => {
        this.$wxShare({
          title: `团队:${this.serverData.teamInfo.teamName || ''}`,
          link: `http://${location.host}/team/${this.serverData.teamInfo.id}/share2join/${this.serverData.pubAccountId}`,
          img: `http:${this.CDN_STATIC_HOST}/themes/mobile/blue/images/xicon_${this.serverData.teamInfo
            .professionalId}.png`,
          desc: '快来加入我的团队吧:)'
        })
      })
    }).catch(e => {
      this.$router.replace('/team/my')
    })
  },
  methods: {
    toJoin() {
      this.$http.post('/team/joinTeam.do', {
        teamId: this.teamid
      }).then(data => {
        this.$router.push('/team/my')
      })
    },
    toQuit() {
      popup.confirm('确认退出该团队吗？').then(action => {
        this.$http.post('/team/delTeamMember.do', {
          teamId: this.teamid
          // memberIds 不给表示自己退出
        }).then(data => {
          this.$router.push('/team/my')
        })
      })
    },
    toDisband() {
      popup.confirm('确认解散该团队吗？').then(action => {
        this.$http.post('/team/disbandTeam.do', {
          teamId: this.teamid
        }).then(data => {
          this.$router.push('/team/my')
        })
      })
    },
    toEdit() {
      this.$router.push(`/team/${this.teamid}/edit`)
    },
    toShareGuide() {
      this.showShareImg = true
      if (process.browser) {
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }
    },
    closeShare() {
      this.showShareImg = false
    }
  },
  data() {
    return {
      serverData: {
        teamInfo: {},
        memberList: [],
        memberCount: 0,
        pubAccountId: null,
        extFieldList: [],
        roleIsTeamMember: false,
        roleIsTeamAdmin: false
      },
      teamid: this.$route.params['id'],
      defUserAvatar: utils.DEFAULT_USER_AVATAR_PIC_PATH,
      showShareImg: false
    }
  }
}
</script>


<style lang="scss" scoped>
.member-list-btn {
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 14px;
}

.share-fenx {
  background-color: #333;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: calc(100%);
  img {
    width: 100%;
  }
}
</style>
