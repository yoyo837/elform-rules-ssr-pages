<template>
  <section class="container container-pd">
    <Card title-text="个人资料" title-icon="fa fa-id-card">
      <ProfilePanel :pic-path="serverData.userInfo.avatar">
        {{serverData.userInfo.realName}}/{{serverData.userInfo.mobile}}
      </ProfilePanel>
      <ProfileField>
        性别：
        <template slot="value">{{genderText}}</template>
      </ProfileField>
      <ProfileField>
        手机：
        <template slot="value">{{serverData.userInfo.mobile}}</template>
      </ProfileField>
      <ProfileField>
        生日：
        <template slot="value">{{formatDate(serverData.userInfo.birthday)}}</template>
      </ProfileField>
      <ProfileField>
        证件类型：
        <template slot="value">{{idCardTypeText}}</template>
      </ProfileField>
      <ProfileField>
        证件号码：
        <template slot="value">{{serverData.userInfo.idcard}}</template>
      </ProfileField>
      <template v-if="serverData.userProfessionalInfo">
        <ProfileField v-if="serverData.userProfessionalInfo.professionalId">
          专业类型：
          <template slot="value">{{serverData.userProfessionalInfo.professionalName}}</template>
        </ProfileField>
        <ProfileField v-for="field in serverData.userProfessionalInfo.extFieldList" :key="field.dataId">
          {{field.extShowName}}：
          <template slot="value">{{field.dataShowValue}}</template>
        </ProfileField>
      </template>
    </Card>

    <section class="operation" v-if="serverData.userInfo.canEdit">
      <el-row v-if="serverData.userInfo.canRemoveMember" :gutter="5">
        <el-col :span="12">
          <nuxt-link :to="`/user/${this.pubAccountId}/edit${this.teamid || this.key ? '?' : ''}${this.teamid ? `teamid=${this.teamid}` : ''}${this.key ? `key=${this.key}` : ''}`">
            <el-button type="primary" class="full-width shadow-button">修改成员信息</el-button>
          </nuxt-link>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" class="full-width shadow-button" @click="delMemberFromTeam">删除该成员</el-button>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="24">
          <nuxt-link :to="`/user/${this.pubAccountId}/edit${this.teamid || this.key ? '?' : ''}${this.teamid ? `teamid=${this.teamid}` : ''}${this.key ? `key=${this.key}` : ''}`">
            <el-button type="primary" class="full-width shadow-button">修改个人信息</el-button>
          </nuxt-link>
        </el-col>
      </el-row>
    </section>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import popup from '../../../components/popup'
import Card from '../../vue-features/components/Card'
import ProfilePanel from '../../vue-features/components/ProfilePanel'
import bdStyleMixin from '../../vue-features/mixins/body-style'
import ProfileField from '../../vue-features/components/ProfileField'
import { Row, Col, Button, Input } from 'element-ui'

Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: '编辑个人信息'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    ProfilePanel,
    ProfileField,
    Card
  },
  mounted() {
    this.$http.get('/pubUser/userInfo.do', this.mergeParams()).then(data => {
      data = data || {}
      data.userInfo = data.userInfo || {}
      data.userProfessionalInfo = data.userProfessionalInfo || {}

      _.assign(this.serverData, data)
    })
  },
  computed: {
    genderText() {
      switch (this.serverData.userInfo.gender) {
        case 1:
          return '男'
        case 2:
          return '女'
        default:
          return null
      }
    },
    idCardTypeText() {
      const idCardType = this.idCardTypes.find(item => {
        return item.key === this.serverData.userInfo.idcardType
      })
      if (idCardType == null) {
        return null
      }
      return idCardType.label
    }
  },
  methods: {
    delMemberFromTeam() {
      popup.confirm('确认从团队删除该成员吗？').then(action => {
        this.$http.post('/team/delTeamMember.do', {
          teamId: this.teamid,
          memberIds: this.pubAccountId
        }).then(data => {
          this.$router.go(-1)
        })
      })
    },
    mergeParams(params) {
      params = params || {}
      if (this.teamid) {
        params['teamId'] = this.teamid
      }
      if (this.key) {
        params['professionalId'] = this.key
      }
      if (this.pubAccountId) {
        params['pubAccountId'] = this.pubAccountId
      }
      return params
    }
  },
  data() {
    return {
      serverData: {
        userInfo: {},
        userProfessionalInfo: {
          extFieldList: [],
          professionalId: null,
          professionalName: null
        }
      },
      idCardTypes: [{
        key: 0,
        label: '身份证'
      }, {
        key: 1,
        label: '护照'
      }, {
        key: 2,
        label: '驾驶证'
      }, {
        key: 3,
        label: '其他'
      }],
      teamid: this.$route.query['teamid'],
      key: this.$route.query['key'],
      pubAccountId: +this.$route.params['id']
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-panel-card {
  border-bottom: 1px solid #f0f0f0;
}
</style>


