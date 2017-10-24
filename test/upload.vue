<template>
  <section class="container container-shrink container-portable">
    <el-form ref="form" :rules="rules" :model="form">
      <el-form-item>
        <el-input type="file" ref="fileComp"></el-input>
      </el-form-item>
      <el-form-item>
        <el-radio class="radio" v-model="form.privated" :label="true">private</el-radio>
        <el-radio class="radio" v-model="form.privated" :label="false">public</el-radio>
      </el-form-item>
    </el-form>

    <section class="operation">
      <el-button type="primary" class="full-width" @click="toUpload">开始上传</el-button>
    </section>
  </section>
</template>

<script>
import Vue from 'vue'
import popup from '../../components/popup'
import bdStyleMixin from '../vue-features/mixins/body-style'
import { Form, FormItem, Button, Row, Col, Input, Radio } from 'element-ui'

Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Radio.name, Radio)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Input.name, Input)

export default {
  mixins: [bdStyleMixin],
  methods: {
    toUpload() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const input = this.$refs['fileComp'].$el.children[0]
          if (!input.value) {
            popup.alert('请选择文件')
            return
          }
          this.$http
            .post(
              '/commonFile/uploadFile.do',
              {
                privated: this.form.privated,
                file: input
              },
              { multiForm: true }
            )
            .then(data => {})
        }
      })
    }
  },
  data() {
    return {
      rules: {},
      form: {
        file: null,
        privated: true
      }
    }
  }
}
</script>

