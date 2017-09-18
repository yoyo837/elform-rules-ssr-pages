<template>
  <section class="container">
    <ProfilePanel :pic-path="serverData.picPath" size="small" type="team">
    </ProfilePanel>
    <el-form ref="form" :model="serverData" :rules="rules" label-width="80px" class="ctx-bg mintui-style">
      <el-form-item label="团队名称" prop="teamName">
        <el-input v-model="serverData.teamName" placeholder="请输入团队名称"></el-input>
      </el-form-item>
      <el-form-item label="成立时间" prop="teamCreateDate">
        <DatetimePicker type="date" v-model="serverData.teamCreateDate" :start-date="startDate" :end-date="endDate"></DatetimePicker>
      </el-form-item>
      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="serverData.contact" placeholder="请输入团队联系方式"></el-input>
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="serverData.address" placeholder="请输入团队联系地址"></el-input>
      </el-form-item>
      <el-form-item label="所属专业">
        123
      </el-form-item>
      <el-form-item label="所属行业">
        456
      </el-form-item>
      <el-form-item label="团队简介" prop="teamIntro">
        <el-input type="textarea" v-model="serverData.teamIntro"></el-input>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import { Form, FormItem, Button, Input, RadioGroup, Radio } from 'element-ui'
import ProfilePanel from '../vue-features/components/ProfilePanel'
import DatetimePicker from '../vue-features/components/DatetimePicker'

Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Radio.name, Radio)

export default {
  name: 'team-edit',
  components: {
    ProfilePanel,
    DatetimePicker
  },
  mounted() {
    if (this.teamid) {
      // serverData.canEdit  如果没权限直接跳走
    } else if (this.key) {
      this.$http.get('/team/getIndustryInfo.do', {
        professionalId: this.key
      }).then(data => {
        _.assign(this.serverData, data)
      })
    } else {
      this.$router.push('/team/my')
    }
  },
  data() {
    return {
      startDate: moment().subtract(100, 'years').toDate(),
      endDate: moment().toDate(),
      rules: {

      },
      serverData: {
        canEdit: true
      },
      teamid: this.$route.query['teamid'],
      key: this.$route.query['key']
    }
  }
}
</script>

<style>

</style>
