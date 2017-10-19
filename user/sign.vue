<template>
  <section class="container container-pd">
    <Card title-text="签到" title-icon="fa fa-id-card">
      <el-row class="text-center sign-tody">
        <el-col :span="24">
          <img :src="`${CDN_STATIC_HOST}/themes/mobile/red/red1/images/ji-${this.serverData.sameDay == 0 ? '1' : '0'}.png`">
          <div class="day-points">{{serverData.fee}}</div>
          <div class="day-th">第{{serverData.totalDay}}天</div>
        </el-col>
      </el-row>
      <el-row class="text-center bonus-points">
        <el-col :span="24">
          <div class="points-title">当前积分：</div>
        </el-col>
        <el-col :span="24">
          <span class="points-value">{{serverData.accountFee}}</span>分
        </el-col>
      </el-row>
    </Card>

    <section class="operation">
      <el-button type="primary" v-if="serverData.sameDay == 0" @click="toSign" class="full-width shadow-button">签到</el-button>
      <el-button type="primary" v-else :disabled="true" class="full-width">已签到</el-button>
    </section>
    <el-dialog title="短信验证码发送" :visible="visible" class="portal-dialog" :class="{'portal-dialog-mobile': isMbl, 'no-bg':true}">
      <el-button class="cust-btn">
        <!-- <img src="../assets/100x100.png" height="20" width="20" slot="icon">  -->
        <img :src="`${CDN_STATIC_HOST}/themes/mobile/red/red1/images/jif.gif`">
        <span>第{{serverData.totalDay}}天+{{serverData.fee}}分</span>
      </el-button>
    </el-dialog>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import utils from '../../components/utils'
import popup from '../../components/popup'
import { Row, Col, Dialog, Button } from 'element-ui'
import Card from '../vue-features/components/Card'

Vue.component(Dialog.name, Dialog)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)

Vue.component(Button.name, Button)
export default {
  head() {
    return {
      title: '签到'
    }
  },
  components: {
    Card
  },
  mounted() {
    this.$http.get('/pubUser/userSignin.do').then(data => {
      // test
      // data.sameDay = 0
      _.assign(this.serverData, data || {})
    })
  },
  methods: {
    toSign() {
      this.$http.post('/pubUser/addFee.do').then(() => {
        this.visible = true
        popup.alert('签到成功', {
          callback: () => {
            this.serverData.sameDay = 1
            this.visible = false
            this.$router.push('/user/my')
          }
        })
      })
    }
  },
  data() {
    return {
      serverData: {
        accountFee: 0,
        fee: null,
        sameDay: 1, // 0 是没有签
        totalDay: 0
      },
      visible: false,
      isMbl: utils.isMobile()
    }
  }
}
</script>

<style lang="scss" scoped>
.sign-tody {
  padding: 30px 0;
  .el-col {
    position: relative;
    .day-th {
      color: #222;
      font-size: 18px;
      margin-top: 15px;
    }
    .day-points {
      position: absolute;
      top: calc(50% - 13px);
      width: 100%;
      height: 26px;
      line-height: 26px;
      color: #fff;
      font-weight: bold;
      font-size: 22px;
      text-shadow: 1px 1px 1px #999;
    }
  }
}

.bonus-points {
  .points-title {
    padding: 10px 0;
    font-size: 12px;
    color: #999;
  }
  .points-value {
    color: #f26a3e;
    font-size: 36px;
  }
}

.cust-btn {
  width: 100%;
  background-color: #1ac1b3;
  box-shadow: none;
  border-radius: 20px;
  height: auto;
  color: white;
  img {
    vertical-align: middle;
  }
  span {
    float: right;
    margin-top: 40px;
  }
}
</style>

<style lang="scss">
.portal-dialog.no-bg {
  .el-dialog {
    background-color: transparent;
    box-shadow: none;
    .el-dialog__header {
      button {
        i {
          display: none;
        }
      }
    }
  }
}
</style>

