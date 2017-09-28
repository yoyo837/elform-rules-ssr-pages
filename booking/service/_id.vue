<template>
  <section class="container">
    <div class="main-box" v-for="dealPlatform in serverData.dealPlatformList" :key="dealPlatform.platformId">
      <el-form :model="dealPlatform" :rules="rules" ref="form">
        <el-row class="platform-header">
          <el-col :span="6">场地：</el-col>
          <el-col :span="18" class="text-right">{{dealPlatform.platformParentName}} {{dealPlatform.platformName}}</el-col>
          <el-col :span="24" class="text-right">{{dealPlatform.orderDateValue}} {{dealPlatform.startTimeValue}}-{{dealPlatform.endTimeValue}}共{{dealPlatform.bookingTime}}小时</el-col>
          <el-col :span="24" class="text-right">
            ￥{{mul(dealPlatform.platformPrice ||0, dealPlatform.bookingTime || 0)}}元
          </el-col>
        </el-row>
        <el-row class="service-user">
          <template v-for="(name, typeId) in careerTypes" v-if="getUserList(dealPlatform, typeId)">
            <el-col :span="24" :key="name">{{name}}：</el-col>
            <el-col :span="8" class="user-item text-center" :class="{disabled: !user.isChoice || (user.conflictPlatformIds && user.conflictPlatformIds.length) ,selected: user.isSelected}" v-for="user in getUserList(dealPlatform, typeId)" :key="user.sysUserId">
              <div @click="onSelect(dealPlatform, user)">
                <img class="user-img" :src="`${(user.picUrl || [])[1] || `${CDN_IMG_HOST}/user/0/`}200X200.jpg`">
                <div>{{user.realName}}</div>
                <div>{{user.servicePrice}}元</div>
              </div>
            </el-col>
          </template>
        </el-row>
        <el-row class="team-fight" v-if="dealPlatform.isFight">
          <el-col :span="6">选择球队：</el-col>
          <el-col :span="18">
            <el-form-item prop="sportTeamId">
              <el-select v-model="dealPlatform.sportTeamId" placeholder="请选择" style="width: 100%;">
                <el-option v-for="team in serverData.sportTeamList" :key="team.sportTeamId" :label="team.sportName" :value="team.sportTeamId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">队服颜色：</el-col>
          <el-col :span="18">
            <el-form-item prop="sportTeamColor">
              <ColorSelect :data="serverData.ballColorList" v-model="dealPlatform.sportTeamColor"></ColorSelect>
            </el-form-item>
          </el-col>
          <el-col :span="6">联系方式：</el-col>
          <el-col :span="18">
            <el-form-item prop="fightMobile">
              <el-input v-model="dealPlatform.fightMobile" placeholder="请输入团队联系方式"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">约战备注：</el-col>
          <el-col :span="18">
            <el-form-item prop="fightDeclaration">
              <el-input v-model="dealPlatform.fightDeclaration" placeholder="请输入团队约战"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="fixed-bt">
      <el-row>
        <el-col :span="16">
          <div class="money">
            合计{{totalPrice}}元
          </div>
        </el-col>
        <el-col :span="8">
          <div class="btn" @click="toPay">去支付</div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import math from '../../../components/math'
import store from '../../../components/store'
import popup from '../../../components/popup'
import { Row, Col, Select, Option, Form, FormItem, Input } from 'element-ui'
import { Badge } from 'mint-ui'
import bdStyleMixin, { DefaultConfig } from '../../vue-features/mixins/body-style'
import ColorSelect from '../../vue-features/components/ColorSelect'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)
Vue.component(Input.name, Input)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Badge.name, Badge)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: '选择服务人员'
    }
  },
  components: {
    ColorSelect
  },
  mixins: [bdStyleMixin],
  mounted() {
    if (this.platformCache == null || this.platformCache.length === 0) {
      this.$router.push(`/booking/schedule/${this.params.salesId}`) // 跳到选场地
      return
    }
    this.$http.postJSON('/sportPlatformUser/queryByDealPlatform.do', {
      dealPlatformList: this.platformCache
    }).then(data => {
      _.assign(this.serverData, data || {})
    })
  },
  methods: {
    mul: math.mul,
    getUserList(dealPlatform, typeId) {
      if (dealPlatform == null || dealPlatform.sportPlatformUserList == null || typeId == null) {
        return null
      }
      const list = dealPlatform.sportPlatformUserList.filter(user => {
        return user.careerId === +typeId
      })
      return list.length === 0 ? null : list
    },
    onSelect(currentPlatform, currentUser) {
      if ((currentUser.conflictPlatformIds && currentUser.conflictPlatformIds.length) || !currentUser.isChoice) { // 不可操作/禁用
        return
      }
      currentUser.isSelected = !currentUser.isSelected // 设置选中
      // 除了当前场地的此人的其他场地所有人员要检查冲突
      this.serverData.dealPlatformList.forEach(function(platform) {
        platform.sportPlatformUserList.forEach(function(user) {
          if (user === currentUser || !user.isChoice) { // 排除掉自己和不能操作的
            return
          }
          // 服务时间冲突
          // 同一个人，在不同场地，不一定都冲突，在场地A的时间与在场地B的时间有叠加，不代表在场地A的时间与在场地C的时间有叠加，所以要区分开
          if ((platform.startTime < currentPlatform.startTime && platform.endTime > currentPlatform.startTime) ||
            (platform.endTime > currentPlatform.endTime && platform.startTime < currentPlatform.endTime) ||

            (platform.endTime > currentPlatform.endTime && platform.startTime < currentPlatform.startTime) ||
            (platform.endTime < currentPlatform.endTime && platform.startTime > currentPlatform.startTime) ||

            (platform.endTime === currentPlatform.endTime && platform.startTime >= currentPlatform.startTime) ||
            (platform.endTime <= currentPlatform.endTime && platform.startTime === currentPlatform.startTime)
          ) {
            // 与当前platform冲突的人
            if (currentUser.sysUserId === user.sysUserId && currentUser.careerId === user.careerId) {
              user.conflictPlatformIds = user.conflictPlatformIds || [] // 冲突的场地id
              if (currentUser.isSelected) { // 当前是勾选
                user.conflictPlatformIds.push(platform.platformId)
              } else { // 当前是去勾选
                const index = user.conflictPlatformIds.findIndex((id, i) => {
                  return id === platform.platformId
                })
                if (index >= 0) {
                  user.conflictPlatformIds.splice(index, 1)
                }
              }
            }
          }
        })
      })
    },
    toPay() {
      const all = []
      this.$refs['form'].forEach(form => {
        all.push(new Promise((resolve, reject) => {
          form.validate(valid => {
            if (valid) {
              resolve()
            } else {
              reject(new Error())
            }
          })
        }))
      })

      Promise.all(all).then(data => {
        this.$http.postJSON('/deal/save.do', {
          dealPlatformList: this.platformCache.map(platform => {
            const temp = this.serverData.dealPlatformList.find(p => {
              return platform.platformId === p.platformId
            })
            platform.sportTeamId = temp.sportTeamId
            platform.sportTeamColor = temp.sportTeamColor
            platform.fightDeclaration = temp.fightDeclaration
            platform.fightMobile = temp.fightMobile
            return platform
          }),
          dealServiceUserList: (() => {
            const list = []
            this.serverData.dealPlatformList.forEach(function(platform) {
              platform.sportPlatformUserList.forEach(function(user) {
                if (user.isSelected) {
                  list.push({
                    careerId: user.careerId,
                    platformId: platform.platformId,
                    userId: user.sysUserId,
                    platformUserId: user.pplatformUserId,
                    endtime: platform.endTime,
                    startTime: platform.startTime,
                    orderdate: platform.orderDate,
                    salesId: platform.salesId
                  })
                }
              })
            })
            return list
          })()
        }).then(data => {

        })
      }).catch(e => {
        popup.alert('请完善表单项后再试')
      })
    }
  },
  computed: {
    platformTotalPrice() {
      return this.serverData.dealPlatformList.reduce((prev, platform) => {
        return prev + math.mul(platform.platformPrice || 0, platform.bookingTime || 0)
      }, 0)
    },
    totalPrice() {
      let price = this.platformTotalPrice
      this.serverData.dealPlatformList.forEach(function(platform) {
        platform.sportPlatformUserList.forEach(function(user) {
          if (user.isSelected) {
            price += math.add(price, math.mul(user.servicePrice || 0, platform.bookingTime || 0))
          }
        })
      })
      return price
    }
  },
  data() {
    return {
      rules: {
        sportTeamId: [{
          type: 'number',
          required: true,
          message: '请选择约战团队',
          trigger: 'blur'
        }],
        sportTeamColor: [{
          required: true,
          message: '请选择队服颜色'
        }],
        fightMobile: [{
          required: true,
          message: '请填写团队联系方式',
          trigger: 'blur'
        }],
        fightDeclaration: [{
          required: true,
          message: '请填写团队约战备注',
          trigger: 'blur'
        }]
      },
      careerTypes: {
        '200006': '教练',
        '200007': '裁判'
      },
      serverData: {
        ballColorList: [],
        dealPlatformList: [],
        sportTeamList: []
      },
      platformCache: store.session.get('platform_cache'),
      salesId: this.$route.params['id'],
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-service-user`
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: white;
  padding: 8px;
  .main-box {
    .el-row.platform-header,
    .el-row.service-user,
    .el-row.team-fight {
      border-bottom: 1px solid #eee;
      padding: 5px 0;
      .el-col {
        padding: 3px 0;
      }
    }
    .el-row.service-user {
      .user-item {
        font-size: 14px;
        padding: 0;
        border: 2px solid transparent;
        margin: 0 5px 5px 0;
        .user-img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
      }
      .user-item.disabled {
        opacity: .5;
      }
      .user-item.selected {
        border-color: #f52;
      }
    }
    .el-row.team-fight {
      .el-col {
        line-height: 36px;
        font-size: 14px; // .el-form-item {
        //   margin: 0;
        // }
      }
    }
  }

  .fixed-bt {
    z-index: 1;
    background-color: white;
    border-top: 1px solid #eee;
    padding: 0;
    .el-row {
      .el-col {
        color: #FF5E20;
        font-size: 14px;
        .money,
        .btn {
          padding: 15px 0;
        }
        .btn {
          background-color: #FF5E20;
          color: white;
        }
      }
    }
  }
}
</style>

<style lang="scss">
body.bd-pt-service-user {
  padding-bottom: 60px;
}
</style>

