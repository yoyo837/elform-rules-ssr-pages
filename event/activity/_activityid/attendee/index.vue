<template>
  <section class="container container-pd">
    <Card>
      <div class="attendee-title">
        {{serverData.dealSignupName}}
        <span> - {{serverData.teamName}}</span>
      </div>
      <div class="attendee-desc">
        团号：{{serverData.teamId}} 人数：{{serverData.dealSignupUserTotal}}
        <el-button v-if="serverData.dealSignupAdmin" type="text" class="update-list-btn" @click="updateDealSignupTeamInfo">更新团队</el-button>
      </div>
    </Card>

    <Card v-for="group in serverData.dealSignupGroupInfoList" :key="group.groupId" :title-text="group.groupName" class="index-list-box">
      <template v-if="serverData.dealSignupAdmin" slot="header-desc">
        <span @click="addDealSignupGroupMember(group)">
          <i class="el-icon-plus" aria-hidden="true"></i>
          添加成员
        </span>
      </template>
      <template v-for="member in group.dealSignupGroupList">
        <nuxt-link :key="member.pubAccountId" :to="`/user/profile?accountid=${member.pubAccountId}&teamid=${serverData.teamId}`">
          <div class="list-member">
            <img :src="`${member.avatar}`" class="member-avatar">
            <div class="member-content">
              <div class="member-desc text-overflow">
                <div class="member-name">{{member.pubRealName}}</div>
                <div class="member-gender">
                  <i class="fa fa-id-card" aria-hidden="true"></i>
                </div>
              </div>
              <div v-if="serverData.dealSignupAdmin" class="member-operation">
                <el-button type="text" @click.stop="updateGroupProps(member, group,'update')">更新</el-button>
                <el-button type="text" @click.stop="replaceDealSignupGroupMember(member, group)">换人</el-button>
                <el-button type="text" @click.stop="updateGroupProps(member, group,'del')">删除</el-button>
              </div>
            </div>
          </div>
        </nuxt-link>
      </template>
    </Card>

    <DialogComp :title="`请选择${selectSingle ? '更换' : '添加'}`" :visible="visible" class="team-member-dialog" @onClose="onDialogClose">
      <el-checkbox-group v-model="selectIds" :min="1" :max="selectSingle ? 1 : undefined">
        <el-row v-for="member in serverData.memberList" :key="member.pubAccountId">
          <el-col :span="9" class="text-overflow">
            <i class="fa fa-id-card" aria-hidden="true"></i>{{member.realName}}</el-col>
          <el-col :span="5" class="text-overflow">({{member.age}}岁)</el-col>
          <el-col :span="8" class="text-overflow">/{{member.mobile}}</el-col>
          <el-col :span="2">
            <el-checkbox :label="member.pubAccountId">&nbsp;</el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>

      <el-button type="primary" @click="sureDialog">确认</el-button>

    </DialogComp>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import popup from '../../../../../components/popup'
import bdStyleMixin from '../../../../vue-features/mixins/body-style'
import { Button, Row, Col, Checkbox, CheckboxGroup } from 'element-ui'
import Card from '../../../../vue-features/components/Card'
import DialogComp from '../../../../vue-features/components/Dialog'

Vue.component(Button.name, Button)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Checkbox.name, Checkbox)
Vue.component(CheckboxGroup.name, CheckboxGroup)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.activityid)
  },
  head() {
    return {
      title: '我的活动'
    }
  },
  mixins: [bdStyleMixin],
  mounted() {
    this.loadData()
  },
  components: {
    Card,
    DialogComp
  },
  methods: {
    loadData() {
      this.$http
        .get('/pubActivity/dealSignupInfo.do', {
          pubActivityId: this.pubActivityId
        })
        .then(data => {
          _.assign(this.serverData, data || {})
        })
    },
    onDialogClose() {
      this.closeDialog()
    },
    showDialog() {
      this.visible = true
      this.$http
        .get('/team/teamMemberList.do', {
          teamId: this.serverData.teamId
        })
        .then(data => {
          data = data || {}
          _.assign(this.serverData, {
            memberList: data.memberList || []
          })
        })
    },
    closeDialog() {
      this.selectIds = []
      this.visible = false
    },
    sureDialog() {
      if (this.selectIds.length === 0) {
        popup.alert('请选择人员')
        return
      }
      if (this.selectSingle) {
        if (this.selectIds.length > 1) {
          popup.alert('只能一对一交换')
          return
        }
        this.$http
          .post('/pubActivity/updateDealSignupGroupInfo.do', {
            pubActivityId: this.pubActivityId,
            groupId: this.memberGroup.groupId,
            memberId: this.oldMember.pubAccountId,
            replaceAddMemberId: this.selectIds[0],
            type: 'replace'
          })
          .then(this.signupGroupInfoResultHandler)
      } else {
        this.$http
          .post('/pubActivity/updateDealSignupGroupInfo.do', {
            pubActivityId: this.pubActivityId,
            groupId: this.memberGroup.groupId,
            memberId: this.selectIds.join(','),
            type: 'add'
          })
          .then(this.signupGroupInfoResultHandler)
      }
    },
    signupGroupInfoResultHandler(data) {
      data = data || {}
      if (data.pageTag) {
        if (data.memberId) {
          let foundMember
          this.serverData.dealSignupGroupInfoList.some(item => {
            const mb = item.dealSignupGroupList.find(member => {
              return member.pubAccountId === data.memberId
            })
            if (mb) {
              foundMember = mb
              return true
            }
            return false
          })
          foundMember = foundMember || {
            pubAccountId: data.memberId
          }
          popup.alert(
            `${foundMember.pubRealName ||
            foundMember.realName ||
            foundMember.pubAccountId}(${foundMember.age}):${data.pageTagMsg}`
          )
          return
        }
        if (data.groupId) {
          const foundGroup = this.serverData.dealSignupGroupInfoList.find(item => {
            return item.groupId === data.groupId
          })
          popup.alert(`${foundGroup.groupName}:${data.pageTagMsg}`)
          return
        }
        popup.alert('未知错误')
        return
      }
      this.reload()
    },
    addDealSignupGroupMember(group) {
      this.selectSingle = false
      this.showDialog()
      this.oldMember = null
      this.memberGroup = group
    },
    replaceDealSignupGroupMember(member, group) {
      this.selectSingle = true
      this.oldMember = member
      this.memberGroup = group
      this.showDialog()
    },
    updateDealSignupTeamInfo() {
      this.$http
        .post('/pubActivity/updateDealSignupTeamInfo.do', {
          pubActivityId: this.pubActivityId
        })
        .then(data => {
          this.reload()
        })
    },
    updateGroupProps(member, group, type) {
      this.$http
        .post('/pubActivity/updateDealSignupGroupInfo.do', {
          pubActivityId: this.pubActivityId,
          groupId: group.groupId,
          memberId: member.pubAccountId,
          type
        })
        .then(this.signupGroupInfoResultHandler)
    },
    reload() {
      this.closeDialog()
      this.loadData()
    }
  },
  data() {
    return {
      visible: false,
      selectIds: [],
      selectSingle: true,
      oldMember: null, // for replace
      memberGroup: null, // for replace/add
      serverData: {
        dealSignupAdmin: false,
        dealSignupName: null,
        dealSignupUserTotal: 0,
        teamId: null,
        teamName: null,
        dealSignupGroupInfoList: [],
        memberList: [] // 换人/加人的成员列表
      },
      pubActivityId: this.$route.params['activityid']
    }
  }
}
</script>

<style lang="scss" scoped>
.attendee-title,
.attendee-desc {
  padding: 4px 0;
}
.attendee-title {
  color: #222;
  font-size: 18px;
  font-weight: bolder;
  span {
    font-weight: normal;
    color: #666;
  }
}

.update-list-btn {
  float: right;
  padding: 0;
  padding-left: 10px;
  border-left: 1px solid #f0f0f0;
  border-radius: 0;
}

.index-list-box {
  .list-member {
    padding: 0;
    position: relative;
    .member-content {
      position: absolute;
      top: 0;
      left: 0;
      height: 50px;
      width: 100%;
      padding-left: 50px;
      .member-desc,
      .member-operation {
        display: inline-block;
        height: 100%;
        line-height: 50px;
      }
      .member-desc {
        width: calc(100% - 130px);
      }
      .member-operation {
        vertical-align: top;
        text-align: right;
        width: 130px;
        .el-button {
          border-radius: 0;
          padding: 5px 10px;
          margin: 0;
          color: #666;
          &:first-child {
            padding-left: 0;
          }
          &:last-child {
            padding-right: 0;
            color: #f26a3e;
          }
        }
        .el-button + .el-button {
          border-left: 1px solid #f0f0f0;
        }
      }
    }
  }
}

.team-member-dialog {
  .el-row {
    padding: 3px 0;
    i {
      margin-right: 2px;
    }
  }
}
</style>


