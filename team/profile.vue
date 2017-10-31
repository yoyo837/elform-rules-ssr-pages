<template>
  <section class="container container-pd">
    <Card>
      <ProfilePanel :pic-path="serverData.teamInfo.professionalId" :protruding="false" type="team">
        <template slot="left">团号：{{serverData.teamInfo.id}}</template>
        <!-- <template>{{serverData.teamInfo.teamName || '&nbsp;'}}</template> -->
        <template slot="right">人数：{{serverData.memberCount}}</template>
      </ProfilePanel>
      <nuxt-link :to="`/team/members?teamid=${teamid}`">
        <el-button type="primary" size="mini" class="el-button--ellipse member-list-btn">成员列表</el-button>
      </nuxt-link>
      <el-row class="nav-menu">
        <el-col :span="8" class="nav-menu-col nav-menu-title text-overflow">
          创建人：
        </el-col>
        <el-col :span="16" class="nav-menu-col text-right">
          {{serverData.teamInfo.createRealName}}
        </el-col>
      </el-row>
      <el-row class="nav-menu">
        <el-col :span="8" class="nav-menu-col nav-menu-title text-overflow">
          团队名称：
        </el-col>
        <el-col :span="16" class="nav-menu-col text-right">
          {{serverData.teamInfo.teamName || '&nbsp;'}}
        </el-col>
      </el-row>
      <el-row class="nav-menu">
        <el-col :span="8" class="nav-menu-col nav-menu-title text-overflow">
          成立时间：
        </el-col>
        <el-col :span="16" class="nav-menu-col text-right">
          {{serverData.teamInfo.teamCreateDateValue}}
        </el-col>
      </el-row>
      <el-row class="nav-menu">
        <el-col :span="8" class="nav-menu-col nav-menu-title text-overflow">
          所属分类：
        </el-col>
        <el-col :span="16" class="nav-menu-col text-right">
          {{serverData.teamInfo.professionalIdValue}}
        </el-col>
      </el-row>
      <el-row class="nav-menu">
        <el-col :span="8" class="nav-menu-col nav-menu-title text-overflow">
          联系方式：
        </el-col>
        <el-col :span="16" class="nav-menu-col text-right">
          {{serverData.teamInfo.contact}}
        </el-col>
      </el-row>
      <el-row class="nav-menu">
        <el-col :span="8" class="nav-menu-col nav-menu-title text-overflow">
          选择地区：
        </el-col>
        <el-col :span="16" class="nav-menu-col text-right">

        </el-col>
      </el-row>
      <el-row class="nav-menu">
        <el-col :span="8" class="nav-menu-col nav-menu-title text-overflow">
          详细地址：
        </el-col>
        <el-col :span="16" class="nav-menu-col text-right">
          {{serverData.teamInfo.address}}
        </el-col>
      </el-row>
      <el-row class="nav-menu">
        <el-col :span="8" class="nav-menu-col nav-menu-title text-overflow">
          所属行业：
        </el-col>
        <el-col :span="16" class="nav-menu-col text-right">
          {{serverData.teamInfo.industryIdValue}}
        </el-col>
      </el-row>

      <el-row class="nav-menu" v-for="field in serverData.extFieldList" :key="field.dataId">
        <el-col :span="8" class="nav-menu-col nav-menu-title text-overflow">
          {{field.extShowName}}：
        </el-col>
        <el-col :span="16" class="nav-menu-col text-right">
          {{field.dataShowValue}}
        </el-col>
      </el-row>
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
import utils from '../../components/utils'
import popup from '../../components/popup'
import ProfilePanel from '../vue-features/components/ProfilePanel'
import Card from '../vue-features/components/Card'
import bdStyleMixin from '../vue-features/mixins/body-style'
import { Row, Col, Button } from 'element-ui'
import wxShare from '../../components/wx-share'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  head() {
    return {
      title: `团队-${this.serverData.teamInfo.teamName || ''}`
    }
  },
  mixins: [bdStyleMixin],
  components: {
    ProfilePanel,
    Card
  },
  mounted() {
    this.$http
      .get('/team/teamInfo.do', {
        teamId: this.teamid
      })
      .then(data => {
        data = data || {}
        data.teamInfo = data.teamInfo || {}

        // data.extFieldList = (data.extFieldList || []).map(field => {

        // })
        _.assign(this.serverData, data)
      })
      .catch(e => {
        this.$router.replace('/team/my')
      })

    this.$wxConfig()
  },
  methods: {
    toJoin() {
      this.$http
        .post('/team/joinTeam.do', {
          teamId: this.teamid
        })
        .then(data => {
          this.$router.push('/team/my')
        })
    },
    toQuit() {
      popup
        .confirm('确认退出该团队吗？')
        .then(action => {
          this.$http
            .post('/team/delTeamMember.do', {
              teamId: this.teamid
              // memberIds 不给表示自己退出
            })
            .then(data => {
              this.$router.push('/team/my')
            })
        })
        .catch(e => {})
    },
    toDisband() {
      popup
        .confirm('确认解散该团队吗？')
        .then(action => {
          this.$http
            .post('/team/disbandTeam.do', {
              teamId: this.teamid
            })
            .then(data => {
              this.$router.push('/team/my')
            })
        })
        .catch(e => {})
    },
    toEdit() {
      this.$router.push(`/team/edit?teamid=${this.teamid}`)
    },
    toShareGuide() {
      if (
        wxShare.call(this, {
          title: `团队:${this.serverData.teamInfo.teamName || ''}`,
          link: `/team/share2join/${this.serverData.teamInfo.id}`,
          img: `${this.CDN_STATIC_HOST}/themes/mobile/blue/images/xicon_${this.serverData.teamInfo.professionalId}.png`,
          desc: '快来加入我的团队'
        })
      ) {
        this.showShareImg = true
        if (process.browser) {
          document.documentElement.scrollTop = 0
          document.body.scrollTop = 0
        }
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
        extFieldList: [],
        roleIsTeamMember: false,
        roleIsTeamAdmin: false
      },
      teamid: this.$route.query['teamid'],
      // key: this.$route.query['key'],
      defUserAvatar: utils.DEFAULT_USER_AVATAR_PIC_PATH,
      showShareImg: false
    }
  }
}
</script>


<style lang="scss" scoped>
.profile-panel-card {
  border-bottom: 1px solid #f0f0f0;
}
.nav-menu {
  .nav-menu-col {
    &.nav-menu-title {
      color: #999;
    }
  }
}

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
