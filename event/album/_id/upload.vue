<template>
  <section class="container container-pd">
    <input type="file" accept="image/*" multiple="multiple" class="hidden" ref="input" @change="onSelectFiles">
    <Card>
      <el-form>
        <el-form-item>
          <div class="pic-list">
            <div v-for="item in inProcessFiles" :key="item.key" class="pic-item">
              <img :src="item.value">
              <div class="pic-item-uploading-cover" v-if="item.isUploading">
                <div class="cover-div" :style="{width: `${item.percentUnComplete}%`}"></div>
                <div class="cover-desc">{{100 - item.percentUnComplete}}%</div>
              </div>
              <div class="pic-item-del" @click="delPicItem(item)">
                <i class="el-icon-close" aria-hidden="true"></i>
              </div>
              <!-- <div class="pic-item-cover" v-if="item.isCover"> -->
              <!-- <div class="pic-item-cover">
                            封面
                          </div> -->
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
      <el-button type="primary" class="full-width shadow-button" @click="toSave">保存</el-button>
    </section>
  </section>
</template>

<script>
import MD5 from 'md5.js'
import Vue from 'vue'
import popup from '../../../../components/popup'
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
      const files = this.$refs['input'].files
      if (files.length === 0) {
        popup.alert('未选择文件')
        return
      }
      // const ireg = /image\/.*/i
      const list = [...files].filter(file => {
        // return file.type.match(ireg)
        return true
      })
      if (list.length === 0) {
        popup.alert('未选择图片文件')
        return
      }
      list.forEach(file => {
        const reader = new FileReader()
        reader.onload = (f => {
          return e => {
            const rd = e.target || e.srcElement
            const key = new MD5().update(rd.result).digest('hex')
            const value = rd.result
            if (
              this.inProcessFiles.find(item => {
                return item.key === key
              })
            ) {
              // 在处理
            } else {
              const inProcessFile = {
                key,
                value,
                file: f,
                isUploading: true,
                percentUnComplete: 100
              }
              this.inProcessFiles.push(inProcessFile)
              this.$http
                .post(
                  '/commonFile/uploadFile.do',
                  {
                    // privated: this.form.privated,
                    file: f,
                    fileType: 1
                  },
                  {
                    silent: true,
                    multiForm: true,
                    onUploadProgress(evt) {
                      // progressEvent
                      if (evt.lengthComputable) {
                        const percentComplete = Math.round(evt.loaded * 100 / evt.total)
                        inProcessFile.percentUnComplete = 100 - percentComplete
                      }
                    }
                  }
                )
                .then(data => {
                  inProcessFile.percentUnComplete = 0 // 完成上传
                  inProcessFile.isUploading = false
                })
                .catch(e => {
                  this.delPicItem(inProcessFile)
                })
            }
          }
        })(file)
        reader.readAsDataURL(file)
      })
    },
    delPicItem(inProcessFile) {
      this.inProcessFiles.splice(
        this.inProcessFiles.findIndex(item => {
          return item === inProcessFile
        }),
        1
      )
    },
    toSave() {
      if (
        this.inProcessFiles.some(item => {
          return item.isUploading
        })
      ) {
        popup.alert('请耐心等待上传完成！')
        // return
      }
    }
  },
  data() {
    return {
      inProcessFiles: []
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
      position: relative;
      line-height: normal;
      color: white;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
      .pic-item-del {
        position: absolute;
        top: 2px;
        right: 2px;
        display: inline-block;
        background: rgba(0, 0, 0, 0.3);
        color: white;
        padding: 3px;
        border-radius: 4px;
      }
      .pic-item-cover {
        position: absolute;
        width: calc(100% -2px - 2px); // padding: 2px;
        bottom: 0;
        text-align: center;
        background: rgba(0, 0, 0, 0.3);
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      .pic-item-uploading-cover {
        position: absolute;
        height: calc(100% -2px - 2px); // padding: 2px;;
        width: calc(100% -2px - 2px); // padding: 2px;
        top: 2px;
        text-align: right;
        .cover-desc {
          position: absolute;
          display: flex;
          width: 100%;
          height: 100%;
          top: 0;
          align-items: center;
          justify-content: center;
        }
        .cover-div {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: inline-block;
        }
      }
    }
  }
}
</style>

