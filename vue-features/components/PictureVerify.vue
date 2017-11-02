<template>
  <div>
    <el-button type="text" @click="getSmsCode" :disabled="smsBtnDisabled" class="btn-right">{{smsBtnText}}</el-button>
    <el-input v-model="smsCode" @change="onChange" class="text-right"></el-input>

    <el-dialog title="核验后发送验证码" :visible.sync="dVisible" class="portal-dialog verify-dialog" :class="{'portal-dialog-mobile': isMbl}">
      <img :src="codeSrc" @click="refreshT" alt="验证码加载中" class="verify-codeimg">
      <div class="verify-refresh text-center">
        <span @click="refreshT">看不清，换一张</span>
      </div>
      <el-form ref="codeForm" :model="codeForm" :rules="rules">
        <el-form-item prop="code">
          <el-input placeholder="请输入上方的图像验证码" v-model="codeForm.code" :maxlength="4">
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('codeForm')">确认</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import popup from '../../../components/popup'
import utils from '../../../components/utils'
import { Form, FormItem, Button, Row, Col, Dialog } from 'element-ui'
Vue.component(Dialog.name, Dialog)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)

const storeKey = 'picture-verify-timeout'
const timeout = 60

export default {
  props: {
    mobile: {
      type: String
    },
    type: {
      type: Number,
      required: true
    }
  },
  mounted() {
    this.currTimeout = this.$webStore.session.get(storeKey) || timeout
    if (this.currTimeout > 0 && this.currTimeout < timeout) {
      this.disBtn()
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.smsCode)
    },
    // 刷新图片验证码
    refreshT() {
      this.t = Date.now()
    },
    // 获取验证码
    getSmsCode() {
      if (utils.validator.isMobile(this.mobile)) {
        this.dVisible = true
        this.refreshT()
        return
      }
      popup.alert('请输入合法的手机号码')
    },
    startTimer() {
      if (this.smsBtnDisabled) {
        return
      }

      const fn = () => {
        if (this.currTimeout <= 0) {
          this.enableBtn()
          return
        }
        this.currTimeout--
        this.smsBtnText = `剩余${this.currTimeout}s`
        this.$webStore.session.put(storeKey, this.currTimeout)
        setTimeout(fn, 1000 * 1)
      }
      fn()
    },
    // 禁用按钮并开始倒计时，时间到后重新启用按钮
    disBtn() {
      this.startTimer()
      this.smsBtnDisabled = true // 锁定
    },
    // 恢复
    enableBtn() {
      this.smsBtnDisabled = false // 解锁
      this.smsBtnText = '重新获取'
    },
    // 发送短信
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$http.post('/commonSms/send.do', {
            mobile: this.mobile,
            codeType: this.type, // 1注册，2是找回，3修改手机号
            codeValid: this.codeForm.code
          }).then(() => {
            popup.alert('发送成功，请注意查收')
            this.disBtn()
            this.dVisible = false
          }).catch(() => {
            this.refreshT()
          })
        }
        return false
      })
    }
  },
  computed: {
    codeSrc() {
      return this.$http.getAbstractUrl(`/commonSms/getCode.do?mobile=${this.mobileForImg}&t=${this.t}`)
    }
  },
  watch: {
    dVisible(val, oldVal) {
      if (val) {
        this.mobileForImg = this.mobile
      }
    }
  },
  data() {
    return {
      rules: {
        code: [{
          required: true, message: '请输入右侧的图形验证码', trigger: 'blur'
        }, {
          min: 4, max: 4, message: '请输入完整的图形验证码', trigger: 'blur'
        }]
      },
      isMbl: utils.isMobile(),
      t: Date.now(),
      mobileForImg: null,
      codeForm: {
        code: ''
      },
      smsCode: '',
      dVisible: false,
      smsBtnDisabled: false,
      smsBtnText: '点击获取',
      currTimeout: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    display: inline-block;
    width: 75%;
  }
}

.verify-codeimg {
  border: 1px solid #999;
  min-height: 42px;
  min-width: 82px;
  vertical-align: top;
}

.verify-refresh {
  line-height: normal;
  font-size: 12px;
  color: #999;
}

.btn-right {
  padding: 8px 0 8px 10px;
}
</style>
