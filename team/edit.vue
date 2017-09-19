<template>
  <section class="container">
    <ProfilePanel :pic-path="serverData.picPath" size="small" type="team">
    </ProfilePanel>
    <el-form ref="form" :model="serverData" :rules="rules" label-width="80px" class="ctx-bg mintui-style">
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
        {{serverData.professionalText}}
      </el-form-item>
      <el-form-item label="所属行业">
        {{serverData.industryText}}
      </el-form-item>
      <el-form-item label="团队简介" prop="teamIntro">
        <el-input type="textarea" v-model="serverData.teamIntro"></el-input>
      </el-form-item>
      <template v-for="field in serverData.extFieldList">
        <el-form-item :label="field.extShowName" :key="field.dataId" :prop="field.extName" v-show="field.extDataType > 0" :rules="[{ required: field.isRequired, message: `${field.extDataType == 3 || field.extDataType == 4 ? '请选择' : '请填写'}${field.extShowName}`, trigger: 'blur'}]">
          <template v-if="field.extDataType == 0 || field.extDataType == 1 || field.extDataType == 2">
            <el-input v-model="serverData[field.extName]" :placeholder="field.descr"></el-input>
          </template>
          <template v-else-if="field.extDataType == 3">
            <el-radio-group v-model="serverData[field.extName]">
              <el-radio v-for="item in field.dataTypeValue" :label="item.value" :key="item.value">{{item.name || item.value}}</el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="field.extDataType == 4">
            <el-input v-model="serverData[field.extName]" placeholder="选择文件待完善"></el-input>
          </template>
        </el-form-item>
      </template>
    </el-form>
    <div class="fixed-bt">
      <el-button type="primary" @click="submitForm">保存</el-button>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import { Form, FormItem, Button, Input, RadioGroup, Radio } from 'element-ui'
import bdStyleMixin, { DefaultConfig } from '../vue-features/mixins/body-style'
import ProfilePanel from '../vue-features/components/ProfilePanel'
import DatetimePicker from '../vue-features/components/DatetimePicker'

Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Radio.name, Radio)

export default {
  name: 'team-edit',
  mixins: [bdStyleMixin],
  components: {
    ProfilePanel,
    DatetimePicker
  },
  mounted() {
    if (this.teamid) {
      // serverData.canEdit  如果没权限直接跳走
    } else if (this.key) {
      Promise.all([this.$http.get('/team/getIndustryInfo.do', {
        professionalId: this.key
      }), this.getExtFieldList()]).then(resultList => {
        // 行业/专业信息
        const industryInfo = resultList[0]
        industryInfo.industry = industryInfo.industry || {}
        industryInfo.professional = industryInfo.professional || {}
        _.assign(this.serverData, {
          industry: industryInfo.industry.key, // 行业
          industryText: industryInfo.industry.value,
          professional: industryInfo.professional.key, // 专业
          professionalText: industryInfo.professional.value
        })

        this.serverData.extFieldList = (resultList[1] || []).filter(item => {
          const baseReq = item != null && item.dataId && item.extDataType // 过滤非法
          if (baseReq && item.extDataType === 3) {
            if (_.isArray(item.dataTypeValue)) {
              return item.dataTypeValue.filter(selectItem => {
                return selectItem.value != null
              }).length > 0
            }
            return false
          }
          return baseReq
        })
      })
    } else {
      this.$router.push('/team/my')
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const params = {
            teamInfo: {
              teamName: this.serverData.teamName,
              teamCreateDate: this.serverData.teamCreateDate,
              teamIntro: this.serverData.teamIntro,
              contact: this.serverData.contact,
              address: this.serverData.address,
              professionalId: this.serverData.professional,
              industry: this.serverData.industry
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
            console.log(data)
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
          required: true, message: '请填写团队名称', trigger: 'blur'
        }],
        contact: [{
          required: true, message: '请填写联系方式', trigger: 'blur'
        }]
      },
      serverData: {
        canEdit: true,
        industry: null, // 行业
        industryText: null,
        professional: null, // 专业
        professionalText: null,

        extFieldList: []
      },
      teamid: this.$route.query['teamid'],
      key: this.$route.query['key'],
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-team-edit`
    }
  }
}
</script>

<style lang="scss">
body.bd-pt-team-edit {
  padding-bottom: 50px;
}
</style>
