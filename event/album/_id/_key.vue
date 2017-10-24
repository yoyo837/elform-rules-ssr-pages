<template>
  <section class="container">
    <img src="https://imgsa.baidu.com/news/q%3D100/sign=82cb3f9f5a3d269728d30c5d65fbb24f/11385343fbf2b211b134871bc18065380cd78e48.jpg">
    <div class="operation">
      <el-row>
        <el-col :span="6">
          <el-button type="text" class="full-width">旋转</el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="text" class="full-width">删除</el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="text" class="full-width">保存</el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="text" class="full-width">设为封面</el-button>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import bdStyleMixin from '../../../vue-features/mixins/body-style'
import { Row, Col, Button } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.key)
  },
  head() {
    return {
      title: '图片详情'
    }
  },
  mixins: [bdStyleMixin]
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  display: flex;
  align-items: center;
  height: calc(100% - 44px);
  img {
    width: 100%;
  }
  .operation {
    background-color: white;
    border-top: 1px solid #f0f0f0;
    margin: 0;
    position: fixed;
    width: 100%;
    bottom: 0;
    font-size: 14px;
    height: 44px;
    line-height: 44px;
    .el-row {
      .el-col {
        .el-button {
          margin: 0;
          color: #666;
        }
      }
      .el-col + .el-col {
        .el-button {
          border-left: 1px solid #f0f0f0;
        }
      }
    }
  }
}
</style>

