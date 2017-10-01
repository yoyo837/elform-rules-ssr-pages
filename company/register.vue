<template>
  <section class="container">
    <div class="main-title text-center ctx-bg">
      注册企业账户
    </div>
    <section class="step-section">
      <el-steps :space="`${100/(steps.list.length)}%`" :active="steps.currentStep" :finish-status="steps.finishStatus">
        <el-step v-for="(step, i) in steps.list" :title="step" :key="i"></el-step>
      </el-steps>
    </section>
    <el-card>
      <div class="sub-title text-center" slot="header">
        创建企业账户
      </div>
      <el-form ref="form" v-model="form" :rules="rules">
        <el-form-item prop="realName">
          <el-input v-model="form.realName" placeholder="负责人姓名" icon="fa fa-user-o"></el-input>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="负责人手机" icon="fa fa-phone"></el-input>
        </el-form-item>
        <el-form-item prop="smsCode">
          <VerifyComp :type="1" :mobile="form.mobile" v-model="form.smsCode"></VerifyComp>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="form.pwd" placeholder="密码" icon="fa fa-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="full-width">下一步</el-button>
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
import Vue from 'vue'
import utils from '../../components/utils'
import VerifyComp from '../vue-features/components/PictureVerify'
import bdStyleMixin from '../vue-features/mixins/body-style'
import { Row, Col, Button, Steps, Step, Form, FormItem, Input, Card } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(Steps.name, Steps)
Vue.component(Step.name, Step)
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
  mixins: [bdStyleMixin],
  components: {
    VerifyComp
  },
  methods: {
    checkMobile(rule, value, fn, source, options) {
      if (utils.validator.isMobile(value)) {
        fn([])
      } else {
        fn([new Error()])
      }
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
        password: [{
          required: true, message: '请输入密码', trigger: 'blur'
        }]
      },
      form: {
        realName: null,
        mobile: null,
        smsCode: null,
        pwd: null
      },
      steps: {
        list: ['创建账户', '填写信息', '实名认证', '完成'],
        finishStatus: 'finish', // wait/process/finish/error/success
        currentStep: 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  color: #3c8dbc;
}

@mixin mg() {
  max-width: 380px;
  margin: 20px auto 0 auto;
}

.container {
  .main-title {
    font-size: 20px;
    width: 100%;
    padding: 20px 0;
    color: #3c8dbc;
    box-shadow: 0 0 2px #E3E3E3;
    border-bottom: 1px solid #e3e3e3;
  }
  .step-section {
    max-width: 1000px;
    margin: 0 auto;
  }
  .el-card {
    @include mg;
    margin-top: 5%;
    .el-form {
      padding: 0 10px 10px 10px;
    }
  }

  .redirect-login {
    margin: 20px 0;
  }

  footer {
    @include mg;
    padding: 10px;
    font-size: 14px;
    .el-row {
      .el-col {
        padding: 3px 0;
      }
    }
  }

  .desc-gray {
    color: #999;
  }
}
</style>

