<template>
  <section class="container container-pd">
    <Card title-text="个人资料" title-icon="fa fa-id-card">
      <ProfilePanel :pic-path="serverData.avatar" :protruding="false" @afterUpload="afterUpload">
        <!-- {{serverData.realName}}/{{serverData.mobile}} -->
      </ProfilePanel>
      <el-form ref="form" :model="serverData.userInfo" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="serverData.userInfo.realName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="serverData.userInfo.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" required>
          <el-button type="text" class="btn-right" @click="changeMbl">更改</el-button>
          <el-input v-model="serverData.userInfo.mobile" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <DatetimePicker type="date" v-model="serverData.userInfo.birthday" :start-date="startDate" :end-date="endDate"></DatetimePicker>
        </el-form-item>
        <el-form-item label="证件类型" prop="idcardType">
          <Picker ref="picker" :slots="certificates" v-model="serverData.userInfo.idcardType"></Picker>
        </el-form-item>
        <el-form-item label="证件号码" prop="idcard">
          <el-input v-model="serverData.userInfo.idcard"></el-input>
        </el-form-item>
        <!-- <div class="professional">
                      {{serverData.userProfessionalInfo.professionalName}}
                    </div> -->
        <el-form-item label="专业类型" v-if="serverData.userProfessionalInfo.professionalId">
          <el-input v-model="serverData.userProfessionalInfo.professionalName" readonly></el-input>
        </el-form-item>
        <template v-for="field in serverData.userProfessionalInfo.extFieldList">
          <el-form-item :label="field.extShowName" :key="field.dataId" :prop="field.extName" v-show="field.extDataType > 0" :rules="[{ required: field.isRequired, message: `${field.extDataType == 3 || field.extDataType == 4 ? '请选择' : '请填写'}${field.extShowName}`, trigger: 'blur'}]">
            <template v-if="field.extDataType == 3">
              <el-radio-group v-model="serverData.userInfo[field.extName]">
                <el-radio v-for="item in field.dataTypeValue" :label="item.value" :key="item.value">{{item.name || item.value}}</el-radio>
              </el-radio-group>
            </template>
            <template v-else-if="field.extDataType == 4">
              <el-input v-model="serverData.userInfo[field.extName]" placeholder="选择文件待完善"></el-input>
            </template>
            <template v-else>
              <el-input v-model="serverData.userInfo[field.extName]" :placeholder="field.descr"></el-input>
            </template>
          </el-form-item>
        </template>
      </el-form>
    </Card>

    <section class="operation" v-if="serverData.userInfo.canEdit">
      <el-button type="primary" @click="submitForm" class="full-width shadow-button">保存修改</el-button>
    </section>
  </section>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import Card from '../../vue-features/components/Card'
import ProfilePanel from '../../vue-features/components/ProfilePanel'
import DatetimePicker from '../../vue-features/components/DatetimePicker'
import bdStyleMixin from '../../vue-features/mixins/body-style'
import Picker from '../../vue-features/components/Picker'
import { Form, FormItem, Button, Input, RadioGroup, Radio } from 'element-ui'

Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Radio.name, Radio)

// defaultIndex静态数据不起作用，组件bug
// defaultIndex: 2,
const idCardTypes = [{
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
    Picker,
    DatetimePicker,
    Card
  },
  mounted() {
    this.$http.get('/pubUser/userInfo.do', this.mergeParams()).then(data => {
      data = data || {}
      data.userInfo = data.userInfo || {}
      data.userProfessionalInfo = data.userProfessionalInfo || {}

      if (data.userInfo.canEdit) {
        if (data.userProfessionalInfo.extFieldList) {
          data.userProfessionalInfo.extFieldList.forEach(item => {
            data.userInfo[item.extName] = item.dataValue
          })
        }
        _.assign(this.serverData, data)
      } else {
        this.$router.go(-1)
      }
    })
  },
  methods: {
    afterUpload(data) {
      data = data || {}
      this.serverData.avatar = data.url
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
    },
    changeMbl() {
      this.$router.push('/user/changemobile')
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const params = {
            realName: this.serverData.userInfo.realName,
            gender: this.serverData.userInfo.gender,
            birthday: this.serverData.userInfo.birthday,
            idcardType: this.serverData.userInfo.idcardType,
            idcard: this.serverData.userInfo.idcard,
            extFields: (this.serverData.userProfessionalInfo.extFieldList || []).map(field => {
              return {
                id: field.id,
                dataId: field.dataId,
                dataType: field.extDataType,
                name: field.extName,
                value: this.serverData.userInfo[field.extName]
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
      certificates: [{ values: idCardTypes }],
      rules: {
        realName: [{
          required: true,
          message: '请填写姓名',
          trigger: 'blur'
        }],
        gender: [{
          required: true,
          message: '请选择性别'
        }],
        birthday: [{
          required: true,
          message: '请选择生日'
        }],
        idcardType: [{
          required: true,
          message: '请选择证件类型',
          trigger: 'blur'
        }],
        idcard: [{
          required: true,
          message: '请填写证件号码',
          trigger: 'blur'
        }]
      },
      serverData: {
        userInfo: {},
        userProfessionalInfo: {
          extFieldList: [],
          professionalId: null,
          professionalName: null
        }
      },
      teamid: this.$route.query['teamid'],
      key: this.$route.query['key'],
      pubAccountId: +this.$route.params['id']
    }
  }
}
</script>

