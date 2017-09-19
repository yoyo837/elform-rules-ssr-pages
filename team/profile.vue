<template>
  <section class="container">
    <ProfilePanel :pic-path="serverData.picPath" size="small" type="team">
      <template slot="left">{{serverData.memberCount}}人</template>
      <template>{{serverData.teamInfo.teamName || '&nbsp;'}}</template>
      <template slot="right">
        <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/icont_1.png`" class="team-flag"> 团号{{serverData.teamInfo.id}}
      </template>
    </ProfilePanel>
    <el-row class="members-box">
      <el-col :span="20">
        <div class="text-overflow members-list">
          <nuxt-link v-for="member in serverData.memberList" :key="member.pubAccountId" :to="`/user/profile?pubAccountId=${member.pubAccountId}&teamId=${teamid}`">
            <div class="member">
              <img :src="`${member.avatar || defUserAvatar}60X60.jpg`">
              <div class="text-overflow">{{member.realName}}</div>
            </div>
          </nuxt-link>
        </div>
      </el-col>
      <el-col :span="4" class="text-right">
        <div class="text-overflow members-list">
          <div class="member">
            <div class="member-like">{{serverData.memberCount}}</div>
            <div class="text-overflow">123</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="nav-panel nav-panel-mini">
      <el-col :span="6">
        创建人
      </el-col>
      <el-col :span="18" class="text-right">
        {{serverData.teamInfo.createRealName}}
      </el-col>
    </el-row>
    <el-row class="nav-panel nav-panel-mini">
      <el-col :span="6">
        团队名称
      </el-col>
      <el-col :span="18" class="text-right">
        {{serverData.teamInfo.teamName}}
      </el-col>
    </el-row>
    <el-row class="nav-panel nav-panel-mini">
      <el-col :span="6">
        团队标签
      </el-col>
      <el-col :span="18" class="text-right">
        {{serverData.teamInfo.teamTag}}
      </el-col>
    </el-row>
    <el-row class="nav-panel nav-panel-mini">
      <el-col :span="6">
        成立时间
      </el-col>
      <el-col :span="18" class="text-right">
        {{serverData.teamInfo.teamCreateDateValue}}
      </el-col>
    </el-row>
    <el-row class="nav-panel nav-panel-mini">
      <el-col :span="6">
        联系方式
      </el-col>
      <el-col :span="18" class="text-right">
        {{serverData.teamInfo.contact}}
      </el-col>
    </el-row>
    <el-row class="nav-panel nav-panel-mini">
      <el-col :span="6">
        联系地址
      </el-col>
      <el-col :span="18" class="text-right">
        {{serverData.teamInfo.address}}
      </el-col>
    </el-row>

    <template v-for="field in serverData.extFieldList">
      <el-row class="nav-panel nav-panel-mini" :key="field.dataId">
        <el-col :span="6">
          {{field.extShowName}}
        </el-col>
        <el-col :span="18" class="text-right">
          {{field.dataShowValue}}
        </el-col>
      </el-row>
    </template>

    <el-row class="nav-panel nav-panel-mini">
      <el-col :span="6">
        团队简介
      </el-col>
      <el-col :span="18" class="text-right">
        {{serverData.teamInfo.descr}}
      </el-col>
    </el-row>

    <div class="fixed-bt">
      <template v-if="serverData.roleIsTeamMember">
        <el-button type="danger" key="share" @click="toShare">邀请加入团队</el-button>
        <el-button key="quit" @click="toQuit">退出团队</el-button>
      </template>
      <template v-else-if="serverData.roleIsTeamAdmin">
        <el-button type="danger" key="share" @click="toShare">邀请加入团队</el-button>
        <el-button type="info" key="eidt" @click="toEdit">修改团队信息</el-button>
        <el-button key="disband" @click="toDisband">解散团队</el-button>
      </template>
      <template v-else>
        <el-button type="danger" @click="toJoin" key="join">申请加入</el-button>
      </template>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import utils from '../../components/utils'
import popup from '../../components/popup'
import ProfilePanel from '../vue-features/components/ProfilePanel'
import bdStyleMixin, { DefaultConfig } from '../vue-features/mixins/body-style'
import { Row, Col, Button } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  mixins: [bdStyleMixin],
  components: {
    ProfilePanel
  },
  mounted() {
    const params = {
      teamId: this.teamid
    }
    this.$http.get('/team/teamInfo.do', params).then(data => {
      _.assign(this.serverData, data)
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
      }).catch(e => {
      })
    },
    toDisband() {
      popup.confirm('确认解散该团队吗？').then(action => {
        this.$http.post('/team/disbandTeam.do', {
          teamId: this.teamid
        }).then(data => {
          this.$router.push('/team/my')
        })
      }).catch(e => {
      })
    },
    toEdit() {
      this.$router.push(`/team/edit?teamid=${this.teamid}`)
    },
    toShare() {

    }
  },
  data() {
    return {
      serverData: {
        teamInfo: {},
        memberList: [],
        memberCount: 0,
        extFieldList: [],
        roleIsTeamMember: false,
        roleIsTeamAdmin: false
      },
      teamid: this.$route.query['teamid'],
      // key: this.$route.query['key'],
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-team-profile`,
      defUserAvatar: utils.DEFAULT_USER_AVATAR_PIC_PATH
    }
  }
}
</script>

<style lang="scss">
body.bd-pt-team-profile {
  padding-bottom: 100px;
}
</style>

<style lang="scss" scoped>
.team-flag {
  width: 12px;
  height: 12px;
}

.members-box {
  background-color: white;
  .members-list {
    padding-top: 5px;
    border-bottom: 1px solid #eee;
    overflow-x: auto;
    .member {
      display: inline-block;
      text-align: center;
      font-size: 14px;
      padding: 5px;
      img,
      .member-like {
        border-radius: 50%;
        width: 40px;
        height: 40px;
      }
      img {
        vertical-align: middle;
      }
      .member-like {
        background-color: #fdc62d;
        line-height: 40px;
        color: white;
        font-size: 20px;
      }
    }
  }
}
</style>
