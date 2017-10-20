<template>
  <section class="container container-shrink container-portable">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="box">
      <el-form-item label="新密码" prop="newPwd1">
        <el-input v-model="form.newPwd1" placeholder="请输入新密码" type="password" class="text-right"></el-input>
      </el-form-item>
      <el-form-item label="再次确认" prop="newPwd2">
        <el-input v-model="form.newPwd2" placeholder="请确认新密码" type="password" class="text-right"></el-input>
      </el-form-item>
    </el-form>
    <section class="operation">
      <el-button type="primary" @click="submitForm('form')" class="full-width">确认并登陆</el-button>
    </section>
  </section>
</template>

<script>
import Vue from 'vue'
import { Form, FormItem, Button, Row, Col, Input } from 'element-ui'
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Input.name, Input)
export default {
  name: 'changepwd',
  head() {
    return {
      title: '设置新密码'
    }
  },
  data() {
    return {
      rules: {
        newPwd1: [{
          required: true, message: '请输入您的新密码', trigger: 'blur'
        }],
        newPwd2: [{
          required: true, message: '请确认您的新密码', trigger: 'blur'
        }, {
          min: 1, message: '两次输入密码不一致', validator: this.checkNewPwd, trigger: 'blur'
        }]
      },
      form: {
        newPwd1: '',
        newPwd2: ''
      }
    }
  },
  methods: {
    checkNewPwd(rule, value, fn, source, options) {
      if (this.form.newPwd1 === this.form.newPwd2) {
        fn([])
      } else {
        fn([new Error('13')])
      }
    }, // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/pubUser/updatePwd.do', {
            pwd: this.form.newPwd1,
            pwds: this.form.newPwd2
          }).then(() => {
            this.$router.replace('/user/my')
          })
        }
        return false
      })
    }
  }
}
</script>
