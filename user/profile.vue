<template>
  <section class="container">
    <ProfilePanel :pic-path="serverData.picPath">
      {{serverData.realName}}/{{serverData.mobile}}
    </ProfilePanel>

    <el-form ref="form" :model="serverData" :rules="rules" label-width="80px" class="ctx-bg">
      <el-form-item label="姓名" prop="realName">
        <el-input v-if="serverData.canEdit" v-model="serverData.realName" placeholder="请输入姓名"></el-input>
        <template v-else>
          {{serverData.realName}}
        </template>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-if="serverData.canEdit" v-model="serverData.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
        <template v-else-if="serverData.gender">
          {{serverData.gender == 1 ? '男' : '女'}}
        </template>
      </el-form-item>
      <el-form-item label="手机" prop="mobile" required>
        <template v-if="serverData.canEdit">
          <el-input v-model="serverData.mobile" :readonly="true"></el-input>
          <el-button type="primary" class="btn-right" @click="changeMbl">更改</el-button>
        </template>
        <template v-else>
          {{serverData.mobile}}
        </template>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <DatetimePicker type="date" v-model="serverData.birthday" :start-date="startDate" :end-date="endDate" :can-edit="serverData.canEdit"></DatetimePicker>
      </el-form-item>
      <el-form-item label="证件类型" prop="idcardType">
        <Picker ref="picker" :slots="certificates" v-model="serverData.idcardType" :can-edit="serverData.canEdit"></Picker>
      </el-form-item>
      <el-form-item label="证件号码" prop="idcard">
        <el-input v-if="serverData.canEdit" v-model="serverData.idcard"></el-input>
        <template v-else>
          {{serverData.idcard}}
        </template>
      </el-form-item>
      <template v-if="serverData.userProfessionalInfo.extFieldList.length">
        <div class="professional">
          {{serverData.userProfessionalInfo.professionalName}}
        </div>
        <template v-for="field in serverData.userProfessionalInfo.extFieldList">
          <el-form-item :label="field.extShowName" :key="field.dataId" :prop="field.extName" v-show="field.extDataType > 0" :rules="[{ required: field.isRequired, message: `${field.extDataType == 3 || field.extDataType == 4 ? '请选择' : '请填写'}${field.extShowName}`, trigger: 'blur'}]">
            <template v-if="serverData.canEdit">
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
            </template>
            <template v-else>
              {{field.dataValue}}
            </template>
          </el-form-item>
        </template>
      </template>
    </el-form>

    <div class="fixed-bt" v-if="serverData.canEdit">
      <el-button type="danger" @click="submitForm">保存设置</el-button>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import ProfilePanel from '../vue-features/components/ProfilePanel'
import DatetimePicker from '../vue-features/components/DatetimePicker'
import bdStyleMixin, { DefaultConfig } from '../vue-features/mixins/body-style'
import Picker from '../vue-features/components/Picker'
import { Form, FormItem, Button, Input, RadioGroup, Radio } from 'element-ui'

Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Radio.name, Radio)

const staticSlotList = [{
  // defaultIndex静态数据不起作用，组件bug
  // defaultIndex: 2,
  values: [{
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
  }]
}]

export default {
  name: 'profile',
  head() {
    return {
      title: '个人信息'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    ProfilePanel,
    Picker,
    DatetimePicker
  },
  mounted() {
    this.$http.get('/pubUser/userInfo.do', this.mergeParams()).then(data => {
      data = data || {}
      data.userProfessionalInfo = data.userProfessionalInfo || {}
      data.userProfessionalInfo.extFieldList = data.userProfessionalInfo.extFieldList || []
      _.assign(this.serverData, data.userInfo, {
        userProfessionalInfo: data.userProfessionalInfo
      })
      data.userProfessionalInfo.extFieldList.forEach(field => {
        this.serverData[field.extName] = field.dataValue
      })
    })
  },
  methods: {
    mergeParams(params) {
      params = params || {}
      if (this.teamid) {
        params['teamId'] = this.teamid
      }
      if (this.key) {
        params['professionalId'] = this.key
      }
      if (this.accountId) {
        params['pubAccountId'] = this.accountId
      }
      return params
    },
    changeMbl() {
      this.$router.push('/user/changemobile')
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const params = {
            realName: this.serverData.realName,
            gender: this.serverData.gender,
            birthday: this.serverData.birthday,
            idcardType: this.serverData.idcardType,
            idcard: this.serverData.idcard,
            extFields: this.serverData.userProfessionalInfo.extFieldList.map(field => {
              return {
                id: field.id,
                dataId: field.dataId,
                dataType: field.extDataType,
                name: field.extName,
                value: this.serverData[field.extName]
              }
            })
          }
          this.mergeParams(params)
          this.$http.postJSON('/pubUser/saveUserInfo.do', params).then(() => {
            this.$router.push('/user/my')
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
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-user-profile`,
      certificates: staticSlotList,
      rules: {
        realName: [{
          required: true, message: '请填写姓名', trigger: 'blur'
        }],
        gender: [{
          required: true, message: '请选择性别'
        }],
        birthday: [{
          required: true, message: '请选择生日'
        }],
        idcardType: [{
          required: true, message: '请选择证件类型', trigger: 'blur'
        }],
        idcard: [{
          required: true, message: '请填写证件号码', trigger: 'blur'
        }]
      },
      serverData: {
        canEdit: false,
        realName: null,
        mobile: null,
        gender: 0,
        idcard: null,
        birthday: null,
        userProfessionalInfo: {
          extFieldList: [],
          professionalId: null,
          professionalName: null
        }
      },
      teamid: this.$route.query['teamid'],
      key: this.$route.query['key'],
      accountId: this.$route.query['account']
    }
  }
}
</script>

<style lang="scss">
body.bd-pt-user-profile {
  padding-bottom: 60px;
}
</style>

<style lang="scss" scoped>
.professional {
  border-bottom: 1px solid #ccc;
  color: #999;
  font-size: 14px;
  margin-bottom: 15px;
}
</style>

