<template>
  <section class="reference">
    <div class="profile-bg">
    </div>
    <section class="container container-pd">
      <ProfilePanel :pic-path="pubAccount.avatar" @afterUpload="afterUpload" :protruding="true">
        <template slot="left" v-if="serverData.viewFee">
          <span class="fee">积分：
            <span class="fee-value">{{formatMoney(pubAccount.accountFee, 0)}}</span>
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
        <ProfileField to="/user/account" :for-nav="true">
          <i class="icon-pt-account"></i>
          <span>我的账户</span>
        </ProfileField>
        <ProfileField to="/order" :for-nav="true">
          <i class="icon-pt-order"></i>
          <span>我的订单</span>
        </ProfileField>
        <!-- <ProfileField :for-nav="true">
          <i class="icon-pt-schedule"></i>
          <span>我的课程</span>
        </ProfileField> -->
        <ProfileField to="/team/my" :for-nav="true">
          <i class="icon-pt-team"></i>
          <span>我的团队</span>
        </ProfileField>
        <ProfileField to="/event" :for-nav="true">
          <i class="icon-pt-event"></i>
          <span>我的活动</span>
        </ProfileField>
        <ProfileField to="/user/settings" :for-nav="true">
          <i class="icon-pt-settings"></i>
          <span>设置</span>
        </ProfileField>
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
import { Button } from 'element-ui'
import bdStyleMixin from '../vue-features/mixins/body-style'
import ProfilePanel from '../vue-features/components/ProfilePanel'
import ProfileField from '../vue-features/components/ProfileField'
import Card from '../vue-features/components/Card'

Vue.component(Button.name, Button)

export default {
  head() {
    return {
      title: '个人中心'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    ProfilePanel,
    Card,
    ProfileField
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



