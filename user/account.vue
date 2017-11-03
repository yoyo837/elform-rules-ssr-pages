<template>
  <section class="container container-pd">
    <Card title-text="我的账户" title-icon="icon-pt-account">
      <div class="text-center account-card-content">
        <div class="balance-title">账户余额：</div>
        <div class="balance-value ac-value">
          <span>{{formatMoney(serverData.pubAccount.amount)}}</span>元
        </div>
      </div>
      <!-- <el-row class="el-card__edge el-card__edge-bottom">
          <el-col :span="12">
            <el-button type="text" class="full-width">提现</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="text" class="full-width">充值</el-button>
          </el-col>
        </el-row> -->
    </Card>

    <Card title-text="我的积分" title-icon="icon-pt-fee" v-if="serverData.viewFee">
      <div class="text-center account-card-content">
        <div class="balance-title">当前积分：</div>
        <div class="balance-value ac-value">
          <span>{{formatMoney(serverData.pubAccount.accountFee, 0)}}</span>分
        </div>
      </div>
      <el-row class="el-card__edge el-card__edge-bottom">
        <nuxt-link to="/user/sign">
          <el-col :span="24">
            <el-button type="text" class="full-width">去签到</el-button>
          </el-col>
        </nuxt-link>
      </el-row>
    </Card>

    <Card title-text="我的优惠" title-icon="icon-pt-coupon">
      <div class="account-card-content">
        <div v-if="serverData.pubServiceAccountList && serverData.pubServiceAccountList.length" class="text-center">
          <Stamp v-for="item in serverData.pubServiceAccountList" :key="item.pubServiceId" :data="item">
          </Stamp>
        </div>
        <div class="balance-title text-center" v-else>
          暂无优惠
        </div>
      </div>
    </Card>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import bdStyleMixin from '../vue-features/mixins/body-style'
import { Row, Col, Button } from 'element-ui'
import Card from '../vue-features/components/Card'
import Stamp from '../vue-features/components/Stamp'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  head() {
    return {
      title: '我的账户'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    Card,
    Stamp
  },
  mounted() {
    this.$http.get('/pubUser/pubAccount.do').then(data => {
      data = data || {}
      data.pubAccount = data.pubAccount || {}
      _.assign(this.serverData, data)
    })
  },
  data() {
    return {
      serverData: {
        viewFee: false,
        pubServiceAccountList: [],
        pubAccount: {
          accountFee: 0,
          amount: 0,
          companyId: null,
          mobile: '--',
          avatar: '',
          pubAccountId: null,
          pubUserId: null,
          realName: '--',
          srvId: null,
          wechatId: ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .account-card-content {
    .ac-value {
      span {
        font-size: 36px;
        color: #f26a3e;
      }
    }
    .balance-title {
      padding: 15px 0;
      font-size: 12px;
      color: #999;
    }

    .balance-value {
      padding: 15px 0;
    }
  }
}
</style>
