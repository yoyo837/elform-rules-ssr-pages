<template>
  <section class="company-register-body">
    <footer class="ctx-bg">
      <section class="footer-title text-center">
        “资料已提交成功”
      </section>
      <section>
        <el-row class="text-center">
          <el-col :span="24">
            <a href="javascript:;">审核将在1-5个工作日内完成</a>
          </el-col>
          <el-col :span="24">
            <a href="javascript:;">审核结果将以短信形式发送到注册使用手机号码</a>
          </el-col>
        </el-row>
        <section class="footer-footer">
          <el-row class="text-center">
            <el-col :span="24">
              <a href="javascript:;">去了解下，活动报备管理流程</a>
            </el-col>
            <el-col :span="24" class="desc-gray">
              <a href="javascript:;">咨询电话：0755-83130059 </a>
            </el-col>
          </el-row>
        </section>
      </section>
    </footer>
  </section>
</template>

<script>
import Vue from 'vue'
import { Row, Col } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)

export default {
  mounted() {
    this.$emit('updataStep', 4)
  }
}
</script>

<style lang="scss" scoped>
.company-register-body {
  footer {
    padding: 20px;
    max-width: 480px;
    .footer-title {
      color: #f52;
      font-size: 18px;
      padding: 15px 0;
    }
    .footer-footer {
      background: #f9f9f9;
      color: #4c4c4c;
      padding: 20px 0;
      margin-top: 10px;
      a {
        font-size: 12px;
      }
      .desc-gray {
        a {
          color: #999;
        }
      }
    }
  }
}
</style>

