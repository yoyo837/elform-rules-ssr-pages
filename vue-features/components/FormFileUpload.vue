<template>
  <el-upload class="form-upload" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList">
    <div class="upload-btn-wrapper text-right">
      <div class="holder-text">{{placeholder}}</div>
      <el-button size="small" type="primary">点击上传</el-button>
    </div>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
  </el-upload>
</template>

<script>
import Vue from 'vue'
import { Button, Upload } from 'element-ui'

Vue.component(Button.name, Button)
Vue.component(Upload.name, Upload)

export default {
  props: {
    placeholder: {
      type: String,
      default: '选择文件'
    }
  },
  data() {
    return {
      fileList: []
    }
  }
}
</script>

<style lang="scss" scoped>
.holder-text {
  float: left;
  color: #1f2d3d;
}
</style>

