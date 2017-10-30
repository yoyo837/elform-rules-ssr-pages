<template>
  <section class="reference">
    <div class="profile-bg">
    </div>
    <section class="container container-pd">
      <ProfilePanel :pic-path="pubAccount.avatar" @afterUpload="afterUpload">
        <template slot="left" v-if="serverData.viewFee">
          <span class="fee">积分：
            <span class="fee-value">{{pubAccount.accountFee}}</span>
          </span>
        </template>
        <template>
          {{pubAccount.realName}}/{{pubAccount.mobile}}
        </template>
        <template slot="right" v-if="serverData.viewFee">
          <nuxt-link to="/user/sign">
            <el-button type="desc" size="mini" class="el-button--ellipse sign-btn">签到</el-button>
          </nuxt-link>
        </template>
      </ProfilePanel>

      <Card :mini="true">
        <el-row class="nav-menu" title="我的账户">
          <nuxt-link to="/user/account">
            <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
              <i class="fa fa-id-card"></i>
              <span>我的账户</span>
            </el-col>
            <el-col :span="4" class="nav-menu-col text-right">
              <i class="el-icon-arrow-right" aria-hidden="true"></i>
            </el-col>
          </nuxt-link>
        </el-row>
        <el-row class="nav-menu" title="我的订单">
          <nuxt-link to="/order">
            <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
              <i class="fa fa-id-card"></i>
              <span>我的订单</span>
            </el-col>
            <el-col :span="4" class="nav-menu-col text-right">
              <i class="el-icon-arrow-right" aria-hidden="true"></i>
            </el-col>
          </nuxt-link>
        </el-row>
        <el-row class="nav-menu" title="我的课程">
          <nuxt-link to="#">
            <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
              <i class="fa fa-id-card"></i>
              <span>我的课程</span>
            </el-col>
            <el-col :span="4" class="nav-menu-col text-right">
              <i class="el-icon-arrow-right" aria-hidden="true"></i>
            </el-col>
          </nuxt-link>
        </el-row>
        <el-row class="nav-menu" title="我的团队">
          <nuxt-link to="/team/my">
            <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
              <i class="fa fa-id-card"></i>
              <span>我的团队</span>
            </el-col>
            <el-col :span="4" class="nav-menu-col text-right">
              <i class="el-icon-arrow-right" aria-hidden="true"></i>
            </el-col>
          </nuxt-link>
        </el-row>
        <el-row class="nav-menu" title="我的活动">
          <nuxt-link to="/event">
            <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
              <i class="fa fa-id-card"></i>
              <span>我的活动</span>
            </el-col>
            <el-col :span="4" class="nav-menu-col text-right">
              <i class="el-icon-arrow-right" aria-hidden="true"></i>
            </el-col>
          </nuxt-link>
        </el-row>
        <el-row class="nav-menu" title="设置">
          <nuxt-link to="/user/settings">
            <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
              <i class="fa fa-id-card"></i>
              <span>设置</span>
            </el-col>
            <el-col :span="4" class="nav-menu-col text-right">
              <i class="el-icon-arrow-right" aria-hidden="true"></i>
            </el-col>
          </nuxt-link>
        </el-row>
      </Card>

      <section class="operation">
        <el-button type="primary" class="full-width shadow-button" @click="toLogout">退出账号</el-button>
      </section>
    </section>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import { Row, Col, Button } from 'element-ui'
import bdStyleMixin from '../vue-features/mixins/body-style'
import ProfilePanel from '../vue-features/components/ProfilePanel'
import Card from '../vue-features/components/Card'
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  head() {
    return {
      title: '用户中心'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    ProfilePanel,
    Card
  },
  mounted() {
    this.$http.get('/pubUser/my.do').then(data => {
      data = data || {}
      data.pubAccount = data.pubAccount || {}
      _.assign(this.serverData, data)
    })
  },
  computed: {
    pubAccount() {
      return this.serverData.pubAccount
    }
  },
  methods: {
    toLogout() {
      this.$http.post('/pubUser/logout.do').then(() => {
        this.$webStore.session.clear()
        this.$router.push('/')
      })
    },
    afterUpload(data) {
      data = data || {}
      this.pubAccount.avatar = data.url
    }
  },
  data() {
    return {
      serverData: {
        viewFee: false,
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
.reference {
  position: relative;
  .container {
    position: absolute;
    width: 100%;
    .fee {
      color: #999;
      .fee-value {
        color: #ff0000;
      }
    }
    .sign-btn {
      font-size: 14px;
      padding: 4px 10px;
      background-color: transparent;
    }
  }

  .profile-bg {
    width: 100%;
    position: absolute;
    top: 0;
    height: 175px;
    background-image: linear-gradient(135deg, #b3e7d0 0%, #5fcdb6 100%);
  }
}
</style>



