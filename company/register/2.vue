<template>
  <section class="company-register-body">
    <el-card>
      <div class="sub-title text-center" slot="header">
        填写企业基本信息
      </div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="realName">
          <el-input v-model="form.email" placeholder="企业邮箱" icon="fa fa-envelope"></el-input>
        </el-form-item>
        <el-form-item prop="companyName">
          <el-input v-model="form.companyName" placeholder="企业全称"></el-input>
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
            <a href="javascript:;">注册前需要准备什么资料？</a>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            1.公司资料、法人代表资料、公司证件彩照
            <span class="desc-gray">（营业执照/组织机构代码/三证合一证）</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            2.负责人手机号：
          </el-col>
          <el-col :span="16" class="desc-gray">
            登录账号，需要接收审核短信
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            3.负责人：
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
import { Row, Col, Button, Form, FormItem, Input, Card } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Card.name, Card)

export default {
  mounted() {
    this.$emit('updataStep', 2)
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
      rules: {

      },
      form: _.assign({
        email: null,
        companyName: null
      }, _.cloneDeep(this.$parent.registerData))
    }
  }
}
</script>
