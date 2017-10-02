<template>
  <section class="company-register-body">
    <el-card>
      <div class="sub-title text-center" slot="header">
        实名认证
      </div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="idCardType">
          <el-select v-model="form.idCardType" placeholder="选择证件类型" class="full-width">
            <el-option v-for="item in certificates" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="idCardNo">
          <el-input v-model="form.idCardNo" placeholder="证件号码" icon="edit"></el-input>
        </el-form-item>
        <el-form-item prop="idCardFile">
          <FormFileUpload placeholder="上传证书"></FormFileUpload>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="form.regDate" class="full-width" placeholder="成立日期" :editable="false"></el-date-picker>
        </el-form-item>
        <el-form-item prop="corporate">
          <el-input v-model="form.corporate" placeholder="法人代表" icon="fa fa-user"></el-input>
        </el-form-item>
        <el-form-item prop="corporateTel">
          <el-input v-model="form.corporateTel" placeholder="法人电话" icon="fa fa-mobile"></el-input>
        </el-form-item>
        <el-form-item prop="officeLocation">
          <el-input v-model="form.officeLocation" placeholder="办公地点" icon="fa fa-home"></el-input>
        </el-form-item>
        <el-form-item prop="officeTel">
          <el-input v-model="form.officeTel" placeholder="办公电话" icon="fa fa-phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="full-width" @click="toNext">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <footer class="ctx-bg">
      <section>
        <el-row class="text-center">
          <el-col :span="24">
            <a href="javascript:;">注册前需要准备什么资料？</a>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            证件号码：
          </el-col>
          <el-col :span="18" class="desc-gray">
            营业执照注册号、组织机构代码、三证合一(18位统一社会信用代码)
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            上传证书：
          </el-col>
          <el-col :span="18" class="desc-gray">
            <a href="javascript:;">请上传彩色图片格式</a>上传的企业证书请与证件号一致（营业执照注册号/组织机构代码/三证合一证书）
          </el-col>
        </el-row>
        <div class="desc-gray sign-row text-center">
          资料提交成功后，审核将在1-5个工作日内完成
        </div>
      </section>
    </footer>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import FormFileUpload from '../../vue-features/components/FormFileUpload'
import { Row, Col, Button, Form, FormItem, Input, Card, Select, Option, DatePicker } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Card.name, Card)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)
Vue.component(DatePicker.name, DatePicker)

export default {
  mounted() {
    this.$emit('updataStep', 3)
  },
  components: {
    FormFileUpload
  },
  methods: {
    toNext() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit('updateData', _.cloneDeep(this.form))
        }
      })
    }
  },
  data() {
    return {
      certificates: [{
        label: '三证合一',
        value: 1
      }, {
        label: '营业执照',
        value: 2
      }, {
        label: '组织机构代码证',
        value: 3
      }],
      rules: {

      },
      form: _.assign({
        idCardType: null,
        regDate: null
      }, _.cloneDeep(this.$parent.registerData)),
      fileList: []
    }
  }
}
</script>

<style lang="scss" scoped>
.sign-row {
  padding: 15px 0;
}
</style>

