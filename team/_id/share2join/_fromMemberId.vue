<template>
  <section class="container container-pd">
    <Card>
      <ProfilePanel :pic-path="serverData.teamInfo.professionalId" type="team">
        <div class="invite-username">{{serverData.inviteUserInfo.realName}}</div>
        <div class="invite-desc">邀请您火速入队</div>
      </ProfilePanel>
      <ProfileField>
        团队名称：
        <template slot="value">{{serverData.teamInfo.teamName}}</template>
      </ProfileField>
      <ProfileField>
        创建人：
        <template slot="value">{{serverData.teamInfo.createRealName}}</template>
      </ProfileField>
      <ProfileField>
        成员数量：
        <template slot="value">{{serverData.memberCount}}</template>
      </ProfileField>
      <ProfileField>
        所属分类：
        <template slot="value">{{serverData.teamInfo.professionalIdValue}}</template>
      </ProfileField>
    </Card>

    <section class="operation">
      <el-button type="primary" @click="toJoin" class="full-width shadow-button">加入团队</el-button>
    </section>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import popup from '../../../../components/popup'
import Card from '../../../vue-features/components/Card'
import { Button } from 'element-ui'
import ProfileField from '../../../vue-features/components/ProfileField'
import ProfilePanel from '../../../vue-features/components/ProfilePanel'
import bdStyleMixin from '../../../vue-features/mixins/body-style'

Vue.component(Button.name, Button)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id) && /^\d+$/.test(params.fromMemberId)
  },
  head() {
    return {
      title: '邀请加入'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    Card,
    ProfilePanel,
    ProfileField
  },
  mounted() {
    this.$http.get('/team/teamSimpleInfo.do', {
      teamId: this.teamid,
      invitePubAccountId: this.fromMemberId
    }).then(data => {
      data = data || {}
      data.inviteUserInfo = data.inviteUserInfo || {}
      data.teamInfo = data.teamInfo || {}

      _.assign(this.serverData, data)
    })
  },
  methods: {
    toJoin() {
      if (this.serverData.pageTag === 'needAddInfo') {
        popup.alert('信息不足，需要补齐信息才能加入该团队! 跳转中...', {
          callback: () => {
            this.$router.push(`/user/0/edit?teamid=${this.teamid}&key=${this.serverData.teamInfo.professionalId}`)
          }
        })
        return
      }
      if (this.serverData.roleIsTeamMember) {
        popup.alert('你已经在团队中，请不要重复加入! 跳转中...', {
          callback: () => {
            this.$router.push(`/team/${this.teamid}`)
          }
        })
        return
      }
      this.$http.post('/team/joinTeam.do', {
        teamId: this.teamid
      }).then(data => {
        this.$router.push('/team/my')
      })
    }
  },
  data() {
    return {
      serverData: {
        inviteUserInfo: {},
        memberCount: 0,
        pageTag: null,
        roleIsTeamMember: false,
        teamInfo: {}
      },
      teamid: this.$route.params['id'],
      fromMemberId: this.$route.params['fromMemberId']
    }
  }
}
</script>

<style lang="scss" scoped>
.invite-username {
  font-weight: bolder;
}
.invite-desc {
  font-size: 14px;
  color: #f26a3e;
  padding: 3px 0;
}
</style>
