<template>
  <section class="container container-pd">
    <input type="file" accept="image/*" multiple="multiple" class="hidden" ref="input" @change="onSelectFiles">
    <Card>
      <el-form>
        <el-form-item>
          <div class="pic-list">
            <div class="pic-item">
              <img src="https://imgsa.baidu.com/news/q%3D100/sign=82cb3f9f5a3d269728d30c5d65fbb24f/11385343fbf2b211b134871bc18065380cd78e48.jpg">
            </div>
            <div class="pic-upload text-center">
              <div class="pic-upload-emit" @click="toUpload">
                <div class="camera-wrapper">
                  <i class="fa fa-camera" aria-hidden="true"></i>
                </div>
                <div>
                  点击上传
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="点击添加相册名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" placeholder="在这里详细描述一下您的相册内容…"></el-input>
        </el-form-item>
      </el-form>
      <span>2017-10-20 13:34</span>
    </Card>

    <section class="operation">
      <el-button type="primary" class="full-width shadow-button">保存</el-button>
    </section>
  </section>
</template>

<script>
import Vue from 'vue'
import Card from '../../../vue-features/components/Card'
import { Form, FormItem, Input, Button } from 'element-ui'

Vue.component(Input.name, Input)
Vue.component(FormItem.name, FormItem)
Vue.component(Form.name, Form)
Vue.component(Button.name, Button)

export default {
  head() {
    return {
      title: '上传图片'
    }
  },
  components: {
    Card
  },
  mounted() {
    this.showSelectFile()
  },
  methods: {
    showSelectFile() {
      this.$refs['input'].click()
    },
    toUpload() {
      this.showSelectFile()
    },
    onSelectFiles() {

    }
  }
}
</script>

<style lang="scss" scoped>
// @mixin placeholder() {
//   color: #999;
//   font-size: 12px;
// }
// .el-textarea {
//   background: red;
//   .el-textarea__inner::-webkit-input-placeholder {
//     @include placeholder;
//   }

//   .el-textarea__inner::-moz-placeholder {
//     @include placeholder;
//   }

//   .el-textarea__inner:-ms-input-placeholder {
//     @include placeholder;
//   }

//   .el-textarea__inner::placeholder {
//     @include placeholder;
//   }
// }
.container {
  .pic-list {
    .pic-upload,
    .pic-item {
      width: 80px;
      height: 80px;
      display: inline-block;
      padding: 2px;
      vertical-align: middle;
    }
    .pic-upload {
      .pic-upload-emit {
        width: 100%;
        height: 100%;
        display: inline-block;
        border-radius: 4px;
        border: 1px dashed #999;
        .camera-wrapper {
          position: relative;
          height: 60%;
          font-size: 30px;
          i {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
        .camera-wrapper + div {
          line-height: normal;
        }
      }
    }
    .pic-item {
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

