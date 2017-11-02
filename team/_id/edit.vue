<template>
  <section class="container container-pd">
    <Card title-text="团队资料" title-icon="fa fa-id-card">
      <ProfilePanel :pic-path="serverData.professionalId" type="team">
      </ProfilePanel>
      <el-form ref="form" :model="serverData" :rules="rules" label-width="80px">
        <el-form-item label="团队名称" prop="teamName">
          <el-input v-model="serverData.teamName" placeholder="请输入团队名称"></el-input>
        </el-form-item>
        <el-form-item label="成立时间" prop="teamCreateDate">
          <DatetimePicker type="date" v-model="serverData.teamCreateDate" :start-date="startDate" :end-date="endDate"></DatetimePicker>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="serverData.contact" placeholder="请输入团队联系方式"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="serverData.address" placeholder="请输入团队联系地址"></el-input>
        </el-form-item>
        <el-form-item label="所属专业">
          <el-input v-model="serverData.professionalIdValue" readonly></el-input>
        </el-form-item>
        <el-form-item label="所属行业">
          <el-input v-model="serverData.industryIdValue" readonly></el-input>
        </el-form-item>
        <template v-for="field in serverData.extFieldList">
          <el-form-item :label="field.extShowName" :key="field.dataId" :prop="field.extName" v-show="field.extDataType > 0" :rules="[{ required: field.isRequired, message: `${field.extDataType == 3 || field.extDataType == 4 ? '请选择' : '请填写'}${field.extShowName}`, trigger: 'blur'}]">
            <template v-if="field.extDataType == 3">
              <el-radio-group v-model="serverData[field.extName]">
                <el-radio v-for="item in field.dataTypeValue" :label="item.value" :key="item.value">{{item.name || item.value}}</el-radio>
              </el-radio-group>
            </template>
            <template v-else-if="field.extDataType == 4">
              <el-input v-model="serverData[field.extName]" placeholder="选择文件待完善"></el-input>
            </template>
            <template v-else>
              <el-input v-model="serverData[field.extName]" :placeholder="field.descr"></el-input>
            </template>
          </el-form-item>
        </template>
        <el-form-item label="团队简介" prop="teamIntro">
          <el-input type="textarea" :rows="4" v-model="serverData.teamIntro"></el-input>
        </el-form-item>
      </el-form>
    </Card>

    <section class="operation">
      <el-button v-if="serverData.roleIsTeamAdmin" type="primary" @click="submitForm" class="full-width shadow-button">保存修改</el-button>
      <el-button v-if="serverData.isCreateNew" type="primary" @click="submitForm" class="full-width shadow-button">创建</el-button>
    </section>
  </section>
</template>

<script>
import _ from 'lodash'
import popop from '../../../components/popup'
import moment from 'moment'
import Vue from 'vue'
import { Form, FormItem, Button, Input, RadioGroup, Radio } from 'element-ui'
import bdStyleMixin from '../../vue-features/mixins/body-style'
import ProfilePanel from '../../vue-features/components/ProfilePanel'
import Card from '../../vue-features/components/Card'
import DatetimePicker from '../../vue-features/components/DatetimePicker'

Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Radio.name, Radio)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: `${this.teamid === 0 ? '创建一个团队' : '团队信息'}`
    }
  },
  mixins: [bdStyleMixin],
  components: {
    ProfilePanel,
    DatetimePicker,
    Card
  },
  mounted() {
    if (this.teamid === 0) {
      if (this.key) {
        this.$http.get('/team/checkNeedAddInfo.do', { professionalId: this.key }).then(data => {
          if (data && data.pageTag === 'needAddInfo') {
            popop.alert(`${data.pageTagMsg || 'needAddInfo'} 跳转中...`, {
              callback: () => {
                this.$router.push(`/user/0/edit?key=${this.key}`)
              }
            })
            return
          }
          this.serverData.isCreateNew = true
          Promise.all([
            this.$http.get('/team/getIndustryInfo.do', {
              professionalId: this.key
            }),
            this.getExtFieldList()
          ]).then(resultList => {
            // 行业/专业信息
            const industryInfo = resultList[0]
            industryInfo.industry = industryInfo.industry || {}
            industryInfo.professional = industryInfo.professional || {}
            _.assign(this.serverData, {
              industryId: industryInfo.industry.key, // 行业
              industryIdValue: industryInfo.industry.value,
              professionalId: industryInfo.professional.key, // 专业
              professionalIdValue: industryInfo.professional.value
            })

            this.serverData.extFieldList = resultList[1]
          })
        })
      } else {
        this.$router.go(-1)
      }
    } else {
      this.$http.get('/team/teamEditInfo.do', {
        teamId: this.teamid
      }).then(data => {
        if (!data.roleIsTeamAdmin) {
          this.$router.go(-1)
          return
        }

        (data.extFieldList || []).forEach(field => {
          data.teamInfo[field.extName] = field.dataValue
        })
        _.assign(this.serverData, data.teamInfo, {
          roleIsTeamAdmin: data.roleIsTeamAdmin
        })
      })
    }
  },
  methods: {
    async getExtFieldList() {
      const result = await this.$http.get('/team/teamProfessionalExtFieldList.do', {
        professionalId: this.key
      })
      return result
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const params = {
            teamInfo: {
              teamName: this.serverData.teamName,
              teamCreateDate: this.serverData.teamCreateDate,
              teamIntro: this.serverData.teamIntro,
              contact: this.serverData.contact,
              address: this.serverData.address,
              professionalId: this.serverData.professionalId,
              industryId: this.serverData.industryId
            },
            extInfoList: (this.serverData.extFieldList || []).map(field => {
              return {
                id: field.id,
                dataId: field.dataId,
                dataType: field.extDataType,
                name: field.extName,
                value: this.serverData[field.extName]
              }
            })
          }
          if (this.teamid) {
            params.teamInfo.id = this.teamid
          }

          this.$http.postJSON('/team/saveTeam.do', params).then(data => {
            this.$router.push(`/team/${data.id}`)
          })
        }
        return false
      })
    }
  },
  data() {
    return {
      startDate: moment().subtract(100, 'years').toDate(),
      endDate: moment().toDate(),
      rules: {
        teamName: [{
          required: true,
          message: '请填写团队名称',
          trigger: 'blur'
        }],
        contact: [{
          required: true,
          message: '请填写联系方式',
          trigger: 'blur'
        }]
      },
      serverData: {
        roleIsTeamAdmin: false,

        industryId: null, // 行业
        industryIdValue: null,
        professionalId: null, // 专业
        professionalIdValue: null,

        extFieldList: []
      },
      teamid: +this.$route.params['id'],
      key: this.$route.query['key']
    }
  }
}
</script>
