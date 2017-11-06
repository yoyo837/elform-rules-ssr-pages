<template>
  <section class="container container-shrink container-portable">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入您的手机号" class="text-right"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input v-model="form.pwd" placeholder="请输入密码" type="password" class="text-right"></el-input>
      </el-form-item>
    </el-form>
    <section class="operation">
      <el-button type="primary" @click="submitForm('form')" class="full-width">马上登录</el-button>
    </section>
    <el-row>
      <el-col :span="12">
        <nuxt-link to="/user/register">注册新账号</nuxt-link>
      </el-col>
      <el-col :span="12" class="text-right">
        <nuxt-link to="/user/forgot">忘记了密码</nuxt-link>
      </el-col>
    </el-row>
    <div class="text-center welcome">
      --Welcome--
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import util from '../../components/utils'
import bdStyleMixin from '../vue-features/mixins/body-style'
import { Form, FormItem, Button, Row, Col, Input } from 'element-ui'
const nuxtConfig = require('../../nuxt.config')

Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Input.name, Input)

export default {
  head() {
    return {
      title: '会员登录'
    }
  },
  mixins: [bdStyleMixin],
  data() {
    return {
      rules: {
        mobile: [{
          required: true, message: '请输入您的手机号', trigger: 'blur'
        }, {
          min: 11, max: 11, message: '请输入合法的手机号码', validator: this.checkMobile, trigger: 'blur'
        }],
        pwd: [{
          required: true, message: '请输入密码', trigger: 'blur'
        }]
      },
      form: {
        mobile: '',
        pwd: ''
      }
    }
  },
  methods: {
    checkMobile(rule, value, fn, source, options) {
      if (util.validator.isMobile(value)) {
        fn([])
      } else {
        fn([new Error()])
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/pubUser/login.do', this.form).then(() => {
            // 登录成功
            // redirectURL
            let redirectURL = decodeURIComponent(this.$route.query['redirectURL'] || '')
            const isHashUrl = nuxtConfig.router.router && nuxtConfig.router.router.mode === 'hash'
            const prefix = `${location.protocol}//${location.host}${isHashUrl ? '/#' : ''}`
            if (redirectURL.startsWith(prefix)) {
              redirectURL = redirectURL.substr(prefix.length)
            }
            if (redirectURL.startsWith('http')) { // 前面没能正确截取
              location.replace(redirectURL)
            } else {
              this.$router.replace(redirectURL || '/user/my')
            }
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
  .welcome {
    bottom: 25px;
    color: #D8D8D8;
    margin-top: 75%;
    font-size: 14px;
  }
}
</style>

