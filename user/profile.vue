<template>
  <section class="container container-pd">
    <Card title-text="个人资料" title-icon="fa fa-id-card">
      <ProfilePanel :pic-path="serverData.avatar" :protruding="false" @afterUpload="afterUpload" :pub-account-id="serverData.id">
        <!-- {{serverData.realName}}/{{serverData.mobile}} -->
      </ProfilePanel>
      <el-form ref="form" :model="serverData" :rules="rules" label-width="80px">
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
            <el-button type="text" class="btn-right" @click="changeMbl">更改</el-button>
            <el-input v-model="serverData.mobile" :readonly="true"></el-input>
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
          <!-- <div class="professional">
            {{serverData.userProfessionalInfo.professionalName}}
          </div> -->
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
    </Card>

    <section class="operation" v-if="serverData.canEdit">
      <el-button type="primary" @click="submitForm" class="full-width shadow-button">保存设置</el-button>
    </section>
  </section>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import Card from '../vue-features/components/Card'
import ProfilePanel from '../vue-features/components/ProfilePanel'
import DatetimePicker from '../vue-features/components/DatetimePicker'
import bdStyleMixin from '../vue-features/mixins/body-style'
import Picker from '../vue-features/components/Picker'
import { Form, FormItem, Button, Input, RadioGroup, Radio } from 'element-ui'

Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Radio.name, Radio)

// defaultIndex静态数据不起作用，组件bug
// defaultIndex: 2,
const staticSlotList = [
  {
    values: [
      {
        key: 0,
        label: '身份证'
      },
      {
        key: 1,
        label: '护照'
      },
      {
        key: 2,
        label: '驾驶证'
      },
      {
        key: 3,
        label: '其他'
      }
    ]
  }
]

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
    DatetimePicker,
    Card
  },
  mounted() {
    this.$http.get('/pubUser/userInfo.do', this.mergeParams()).then(data => {
      data = data || {}
      data.userProfessionalInfo = data.userProfessionalInfo || {}
      data.userProfessionalInfo.extFieldList = data.userProfessionalInfo.extFieldList || []
      const extProps = {}
      data.userProfessionalInfo.extFieldList.forEach(field => {
        extProps[field.extName] = field.dataValue
      })
      _.assign(
        this.serverData,
        data.userInfo,
        {
          userProfessionalInfo: data.userProfessionalInfo
        },
        extProps
      )
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
      if (this.accountId) {
        params['pubAccountId'] = this.accountId
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
      startDate: moment()
        .subtract(100, 'years')
        .toDate(),
      endDate: moment().toDate(),
      certificates: staticSlotList,
      rules: {
        realName: [
          {
            required: true,
            message: '请填写姓名',
            trigger: 'blur'
          }
        ],
        gender: [
          {
            required: true,
            message: '请选择性别'
          }
        ],
        birthday: [
          {
            required: true,
            message: '请选择生日'
          }
        ],
        idcardType: [
          {
            required: true,
            message: '请选择证件类型',
            trigger: 'blur'
          }
        ],
        idcard: [
          {
            required: true,
            message: '请填写证件号码',
            trigger: 'blur'
          }
        ]
      },
      serverData: {
        id: null,
        canEdit: false,
        realName: null,
        mobile: null,
        gender: 0,
        idcard: null,
        birthday: null,
        avatar: null,
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

