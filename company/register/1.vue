<template>
  <section class="company-register-body">
    <el-card>
      <div class="sub-title text-center" slot="header">
        创建企业账户
      </div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="realName">
          <el-input v-model="form.realName" placeholder="负责人姓名" icon="fa fa-user"></el-input>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="负责人手机" icon="fa fa-phone"></el-input>
        </el-form-item>
        <el-form-item prop="smsCode">
          <VerifyComp :type="1" :mobile="form.mobile" v-model="form.smsCode"></VerifyComp>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input type="password" v-model="form.pwd" placeholder="密码" icon="fa fa-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="full-width" @click="toNext">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <section class="redirect-login text-center">
      <a href="//cloud.ydmap.com.cn">已有账号，去登陆</a>
    </section>

    <footer class="ctx-bg">
      <section>
        <el-row class="text-center">
          <el-col :span="24">
            <a href="javascript:;">创建账户须知</a>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            负责人手机号：
          </el-col>
          <el-col :span="16" class="desc-gray">
            登录账号，需要接收审核短信
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            负责人：
          </el-col>
          <el-col :span="16">
            <a href="javascript:;">可是法人代表或是代理人员</a>
          </el-col>
        </el-row>
      </section>
    </footer>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import utils from '../../../components/utils'
import VerifyComp from '../../vue-features/components/PictureVerify'
import { Row, Col, Button, Form, FormItem, Input, Card } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Card.name, Card)

export default {
  head() {
    return {
      title: '注册企业账户-创建账户'
    }
  },
  components: {
    VerifyComp
  },
  mounted() {
    this.$emit('updataStep', 1)
  },
  methods: {
    checkMobile(rule, value, fn, source, options) {
      if (utils.validator.isMobile(value)) {
        fn([])
      } else {
        fn([new Error()])
      }
    },
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
      rules: {
        realName: [{
          required: true,
          message: '请输入负责人姓名',
          trigger: 'blur'
        }],
        mobile: [{
          required: true, message: '请输入您的手机号', trigger: 'blur'
        }, {
          min: 11, max: 11, message: '请输入合法的手机号码', validator: this.checkMobile, trigger: 'blur'
        }],
        smsCode: [{
          required: true, message: '请输入验证码', trigger: 'blur'
        }, {
          min: 4, max: 4, message: '请输入完整4位验证码', trigger: 'blur'
        }],
        pwd: [{
          required: true, message: '请输入密码', trigger: 'blur'
        }]
      },
      form: _.assign({
        realName: null,
        mobile: null,
        smsCode: null,
        pwd: null
      }, _.cloneDeep(this.$parent.registerData))
    }
  }
}
</script>
