<template>
  <section class="container container-pd">
    <Card :mini="true">
      <el-row class="nav-menu" title="修改密码">
        <nuxt-link to="/user/changepwd">
          <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
            <i class="fa fa-id-card"></i>
            <span>修改密码</span>
          </el-col>
          <el-col :span="4" class="nav-menu-col text-right">
            <i class="el-icon-arrow-right" aria-hidden="true"></i>
          </el-col>
        </nuxt-link>
      </el-row>
      <el-row class="nav-menu" title="个人资料">
        <nuxt-link to="/user/profile">
          <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
            <i class="fa fa-id-card"></i>
            <span>个人资料</span>
          </el-col>
          <el-col :span="4" class="nav-menu-col text-right">
            <i class="el-icon-arrow-right" aria-hidden="true"></i>
          </el-col>
        </nuxt-link>
      </el-row>
    </Card>

    <Card :mini="true">
      <el-row class="nav-menu" title="关于我们">
        <nuxt-link to="/about">
          <el-col :span="20" class="nav-menu-col nav-menu-title text-overflow">
            <i class="fa fa-id-card"></i>
            <span>关于我们</span>
          </el-col>
          <el-col :span="4" class="nav-menu-col text-right">
            <i class="el-icon-arrow-right" aria-hidden="true"></i>
          </el-col>
        </nuxt-link>
      </el-row>
    </Card>
  </section>
</template>

<script>
import Vue from 'vue'
import { Row, Col } from 'element-ui'
import { Header, Button } from 'mint-ui'
import bdStyleMixin from '../vue-features/mixins/body-style'
import Card from '../vue-features/components/Card'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
export default {
  head() {
    return {
      title: '设置'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    Card
  }
}
</script>
