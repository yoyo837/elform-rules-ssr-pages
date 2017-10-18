<template>
  <section class="container container-shrink container-portable">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="form.realName" placeholder="请输入您的姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入您的手机号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input v-model="form.pwd" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="smsCode">
        <!-- <el-input v-model="form.smsCode" placeholder="请输入验证码"></el-input> -->
        <VerifyComp :type="1" :mobile="form.mobile" v-model="form.smsCode"></VerifyComp>
      </el-form-item>
    </el-form>
    <div class="operation">
      <el-button type="primary" @click="submitForm('form')" class="full-width">确认并登陆</el-button>
      <el-button @click="toLogin" class="full-width">已有账号，直接登陆</el-button>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import utils from '../../components/utils'
import VerifyComp from '../vue-features/components/PictureVerify'
// 引入全部
// import ElementUI from 'element-ui'
// Vue.use(ElementUI)
import { Form, FormItem, Button, Row, Col, Input } from 'element-ui'
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Input.name, Input)

export default {
  head() {
    return {
      title: '会员注册'
    }
  },
  components: {
    VerifyComp
  },
  data() {
    return {
      rules: {
        realName: [{
          required: true, message: '请输入姓名', trigger: 'blur'
        }],
        mobile: [{
          required: true, message: '请输入您的手机号', trigger: 'blur'
        }, {
          min: 11, max: 11, message: '请输入合法的手机号码', validator: this.checkMobile, trigger: 'blur'
        }],
        pwd: [{
          required: true, message: '请输入密码', trigger: 'blur'
        }],
        smsCode: [{
          required: true, message: '请输入验证码', trigger: 'blur'
        }, {
          min: 4, max: 4, message: '请输入完整4位验证码', trigger: 'blur'
        }]
      },
      form: {
        realName: '',
        mobile: '',
        pwd: '',
        smsCode: ''
      }
    }
  },
  methods: {
    toLogin() {
      this.$router.push('/user/login')
    },
    checkMobile(rule, value, fn, source, options) {
      if (utils.validator.isMobile(value)) {
        fn([])
      } else {
        fn([new Error()])
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/pubUser/register.do', {
            // redirectURL:null,
            realName: this.form.realName,
            mobile: this.form.mobile,
            pwd: this.form.pwd,
            smsCode: this.form.smsCode
          }).then(() => {
            this.$router.push('/user/login')
          })
        }
        return false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .operation {
    margin-top: 50px;
  }
}
</style>
