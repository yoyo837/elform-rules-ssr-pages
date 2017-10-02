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
    <nuxt-child @updateData="onUpdateData" @updataStep="onUpdataStep"></nuxt-child>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import bdStyleMixin from '../vue-features/mixins/body-style'
import { Steps, Step } from 'element-ui'

Vue.component(Steps.name, Steps)
Vue.component(Step.name, Step)

export default {
  head() {
    return {
      title: '注册企业账户-创建账户'
    }
  },
  mixins: [bdStyleMixin],
  methods: {
    nextStep() {
      this.$router.push(`/company/register/${++this.steps.currentStep + 1}`)
    },
    onUpdataStep(step) {
      this.steps.currentStep = step - 1
    },
    onUpdateData(form) {
      _.assign(this.registerData, form || {})
      if (this.steps.currentStep < this.steps.list.length - 1) {
        this.nextStep()
      }
    }
  },
  data() {
    return {
      steps: {
        list: ['创建账户', '填写信息', '实名认证', '完成'],
        finishStatus: 'finish', // wait/process/finish/error/success
        currentStep: 0
      },
      registerData: {
        abc: 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
}
</style>

<style lang="scss">
section.company-register-body {
  a {
    color: #3c8dbc;
  }
  .el-card {
    max-width: 380px;
    margin: 5% auto 0 auto;
    .el-form {
      padding: 0 10px 10px 10px;
    }
  }

  .redirect-login {
    margin: 20px 0;
  }

  footer {
    max-width: 380px;
    margin: 20px auto 0 auto;
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


