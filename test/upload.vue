<template>
  <section class="container container-pd container-portable">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="选择文件">
        <el-input type="file" ref="fileComp"></el-input>
      </el-form-item>
      <el-form-item label="是否私有">
        <el-radio class="radio" v-model="form.privated" :label="true">private</el-radio>
        <el-radio class="radio" v-model="form.privated" :label="false">public</el-radio>
      </el-form-item>
      <el-form-item label="选择文件类型" prop="fileType">
        <el-select v-model="form.fileType" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
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
import { Form, FormItem, Button, Row, Col, Input, Radio, Select, Option } from 'element-ui'

Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Radio.name, Radio)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Input.name, Input)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)

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
                file: input,
                fileType: this.form.fileType
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
      options: [
        {
          label: '图片',
          value: 1
        },
        {
          label: '文档',
          value: 2
        }
      ],
      rules: {
        fileType: [
          {
            type: 'number',
            required: true,
            message: '请选择文件类型',
            trigger: 'blur'
          }
        ]
      },
      form: {
        fileType: null,
        file: null,
        privated: true
      }
    }
  }
}
</script>

