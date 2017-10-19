<template>
  <section class="reference">
    <div class="profile-bg">
    </div>
    <section class="container container-pd">
      <ProfilePanel :pic-path="serverData.picPath" @afterUpload="afterUpload" :pub-account-id="serverData.id" :pic-type="serverData.picType">
        <template slot="left" v-if="serverData.isFee">
          <span class="fee">积分：<span class="fee-value">{{serverData.accountFee}}</span></span>
        </template>
        <template>
          {{serverData.realName}}/{{serverData.mobile}}
        </template>
        <template slot="right" v-if="serverData.isFee">
          <nuxt-link to="/user/sign">
            <el-button type="ellipse" size="mini" class="sign-btn">签到</el-button>
          </nuxt-link>
        </template>
      </ProfilePanel>

      <Card>
        <nuxt-link to="/user/account">
          <el-row class="nav-menu" title="我的账户">
            <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
              <i class="fa fa-id-card"></i>
              我的账户
            </el-col>
            <el-col :span="4" class="nav-menu-col text-right">
              <i class="el-icon-arrow-right"></i>
            </el-col>
          </el-row>
        </nuxt-link>
        <nuxt-link to="/order">
          <el-row class="nav-menu" title="我的订单">
            <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
              <i class="fa fa-id-card"></i>
              我的订单
            </el-col>
            <el-col :span="4" class="nav-menu-col text-right">
              <i class="el-icon-arrow-right"></i>
            </el-col>
          </el-row>
        </nuxt-link>
        <nuxt-link to="#">
          <el-row class="nav-menu" title="我的课程">
            <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
              <i class="fa fa-id-card"></i>
              我的课程
            </el-col>
            <el-col :span="4" class="nav-menu-col text-right">
              <i class="el-icon-arrow-right"></i>
            </el-col>
          </el-row>
        </nuxt-link>
        <nuxt-link to="/team/my">
          <el-row class="nav-menu" title="我的团队">
            <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
              <i class="fa fa-id-card"></i>
              我的团队
            </el-col>
            <el-col :span="4" class="nav-menu-col text-right">
              <i class="el-icon-arrow-right"></i>
            </el-col>
          </el-row>
        </nuxt-link>
        <nuxt-link to="/event">
          <el-row class="nav-menu" title="我的活动">
            <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
              <i class="fa fa-id-card"></i>
              我的活动
            </el-col>
            <el-col :span="4" class="nav-menu-col text-right">
              <i class="el-icon-arrow-right"></i>
            </el-col>
          </el-row>
        </nuxt-link>
        <nuxt-link to="/user/settings">
          <el-row class="nav-menu" title="设置">
            <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
              <i class="fa fa-id-card"></i>
              设置
            </el-col>
            <el-col :span="4" class="nav-menu-col text-right">
              <i class="el-icon-arrow-right"></i>
            </el-col>
          </el-row>
        </nuxt-link>
      </Card>

      <section class="operation">
        <el-button type="primary" class="full-width shadow-button">退出账号</el-button>
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
      _.assign(this.serverData, data || {})
      this.serverData.isFee = true
    })
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
      this.serverData.picPath = data.url
    }
  },
  data() {
    return {
      serverData: {
        id: null,
        picType: null,
        wechatId: '',
        isFee: false,
        accountFee: 0,
        picPath: '',
        realName: '--',
        mobile: '--'
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
    height: 200px;
    background-image: linear-gradient(135deg, #b3e7d0 0%, #5fcdb6 100%);
  }
}
</style>



