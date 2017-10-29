<template>
  <section class="container container-pd">
    <Card title-text="我的账户" title-icon="fa fa-id-card">
      <div class="text-center account-card-content">
        <div class="balance-title">账户余额：</div>
        <div class="balance-value ac-value">
          <span>{{serverData.pubAccount.amount}}</span>元
        </div>
      </div>
      <el-row class="el-card__edge el-card__edge-bottom">
        <el-col :span="12">
          <el-button type="text" class="full-width">提现</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="text" class="full-width">充值</el-button>
        </el-col>
      </el-row>
    </Card>

    <Card title-text="我的积分" title-icon="fa fa-id-card" v-if="serverData.viewFee">
      <div class="text-center account-card-content">
        <div class="balance-title">当前积分：</div>
        <div class="balance-value ac-value">
          <span>{{serverData.pubAccount.accountFee}}</span>分
        </div>
      </div>
      <el-row class="el-card__edge el-card__edge-bottom">
        <el-col :span="24">
          <el-button type="text" class="full-width">去签到</el-button>
        </el-col>
      </el-row>
    </Card>

    <Card title-text="我的优惠" title-icon="fa fa-id-card">
      <div class="account-card-content">
        <div v-if="serverData.pubServiceAccountList && serverData.pubServiceAccountList.length">
          <div v-for="item in serverData.pubServiceAccountList" :key="item.pubServiceId" class="stamp">
            <div class="stamp-header">
              <div class="stamp-title text-overflow" :title="item.serviceName">
                {{item.serviceName}}
              </div>
              <el-row>
                <el-col :span="18" class="text-overflow">
                  简介
                </el-col>
                <el-col :span="6" class="text-overflow text-right">
                  券类型
                </el-col>
              </el-row>
            </div>
            <div class="stamp-body">
              <div class="text-overflow-line3 stamp-detail" :title="item.dataContent">
                {{item.dataContent}}
              </div>
              <el-row>
                <el-col :span="18" class="text-overflow highlight">
                  有效期{{item.startDate}}至{{item.endDate}}
                </el-col>
                <el-col :span="6" class="text-overflow highlight text-right">
                  ￥{{item.serviceAmount}}
                </el-col>
              </el-row>
            </div>
          </div>
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
    Card
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

    .stamp {
      font-size: 12px;
      user-select: none;
      border: 2px solid #fff;
      height: 125px;
      width: 263px;
      padding-top: 10px;
      margin: 2px;
      display: inline-block;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      background: #4cd0d3;
      background: radial-gradient(transparent 0, transparent 5px, #4cd0d3 0);
      background-size: 15px 15px;
      background-position: 3px 8px;

      .highlight {
        color: #f26a3e;
      }

      .stamp-header {
        background-color: #4cd0d3;
        color: #fff;
        height: 40%;
        padding: 0 5px;

        .stamp-title {
          font-size: 18px;
        }

        .stamp-title + .el-row {
          .el-col {
            padding: 5px 0;
          }
        }
      }

      .stamp-body {
        background-color: #fff;
        color: #4cd0d3;
        height: 60%;
        border: 1px solid rgba(76, 208, 211, 0.5);
        border-top: none;
        padding: 0 5px;

        .stamp-detail {
          color: #999;
          padding-top: 5px;
        }

        .stamp-detail + .el-row {
          .el-col {
            padding-top: 5px;
          }
        }
      }
    }
  }
}
</style>
