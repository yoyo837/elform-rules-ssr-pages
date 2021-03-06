<template>
  <section class="container container-pd">
    <Card v-for="dealPlatform in serverData.dealPlatformList" :key="dealPlatform.platformId">
      <el-form :model="dealPlatform" :rules="rules" ref="form">
        <div class="item-one">
          <div class="item-title">
            场地
          </div>
          <div class="item-content">
            <div>
              {{dealPlatform.platformParentName}} {{dealPlatform.platformName}}({{dealPlatform.orderDateValue}} {{dealPlatform.startTimeValue}}-{{dealPlatform.endTimeValue}})
            </div>
            <div>
              共{{dealPlatform.bookingTime}}小时
              <span class="price">{{dealPlatform.platformPrice}}</span>元
            </div>
          </div>
          <template v-for="(name, typeId) in careerTypes" v-if="getUserList(dealPlatform, typeId)">
            <div class="item-title" :key="name">
              {{name}}
            </div>
            <div class="item-content" :key="name">
              <el-row>
                <el-col :span="8" class="user-item text-center" :class="{disabled: !user.isChoice || (user.conflictPlatformIds && user.conflictPlatformIds.length) ,selected: user.isSelected}" v-for="user in getUserList(dealPlatform, typeId)" :key="user.sysUserId">
                  <div @click="onSelect(dealPlatform, user)">
                    <img class="user-img" :src="`${(user.picUrl || [])[1] || `${CDN_IMG_HOST}/user/0/`}200X200.jpg`">
                    <div>{{user.realName}}</div>
                    <div>{{user.servicePrice}}元</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
          <template v-if="dealPlatform.isFight">
            <div class="item-title">
              约战
            </div>
            <div class="item-content">
              <el-form-item prop="sportTeamId">
                <el-select v-model="dealPlatform.sportTeamId" placeholder="请选择团队">
                  <el-option v-for="team in serverData.sportTeamList" :key="team.sportTeamId" :label="team.sportName" :value="team.sportTeamId"></el-option>
                  <el-option :value="0" class="team-addnew text-center">
                    <el-button size="mini" type="primary" @click.stop="addNewTeam(dealPlatform)">
                      <i class="el-icon-plus" aria-hidden="true"></i>
                    </el-button>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="sportTeamColor">
                <!-- <ColorSelect :data="serverData.ballColorList" v-model="dealPlatform.sportTeamColor"></ColorSelect> -->
                <el-select v-model="dealPlatform.sportTeamColor" placeholder="请选择队服颜色">
                  <el-option v-for="colorItem in serverData.ballColorList" :key="colorItem.key" :label="colorItem.title" :value="colorItem.key">
                    <mt-badge size="small" :color="colorItem.rgb" :style="{color:blackOrWhite(colorItem.rgb)}">{{colorItem.title}}</mt-badge>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="fightMobile">
                <el-input v-model="dealPlatform.fightMobile" placeholder="请输入团队联系方式"></el-input>
              </el-form-item>
              <el-form-item prop="fightDeclaration">
                <el-input v-model="dealPlatform.fightDeclaration" placeholder="请输入团队约战"></el-input>
              </el-form-item>
            </div>
          </template>
        </div>
      </el-form>
    </Card>

    <div class="fixed-bt">
      <el-row>
        <el-col :span="16">
          <div class="money">
            共计￥
            <span>{{totalPrice || 0}}</span> 元
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
import popup from '../../../components/popup'
import color from '../../../components/color'
import { Row, Col, Select, Option, Form, FormItem, Input, Button } from 'element-ui'
import { Badge } from 'mint-ui'
import bdStyleMixin, { DefaultConfig } from '../../vue-features/mixins/body-style'
import ColorSelect from '../../vue-features/components/ColorSelect'
import Card from '../../vue-features/components/Card'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)
Vue.component(Input.name, Input)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Badge.name, Badge)
Vue.component(Button.name, Button)

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
    Card,
    ColorSelect
  },
  mixins: [bdStyleMixin],
  mounted() {
    if (this.platformCache == null || this.platformCache.length === 0) {
      this.$router.push(`/booking/schedule/${this.params.salesId}`) // 跳到选场地
      return
    }
    this.$http
      .postJSON('/sportPlatformUser/queryByDealPlatform.do', {
        dealPlatformList: this.platformCache
      })
      .then(data => {
        _.assign(this.serverData, data || {})
      })
  },
  methods: {
    blackOrWhite: color.blackOrWhite,
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
      if ((currentUser.conflictPlatformIds && currentUser.conflictPlatformIds.length) || !currentUser.isChoice) {
        // 不可操作/禁用
        return
      }
      currentUser.isSelected = !currentUser.isSelected // 设置选中
      // 除了当前场地的此人的其他场地所有人员要检查冲突
      this.serverData.dealPlatformList.forEach(function (platform) {
        platform.sportPlatformUserList.forEach(function (user) {
          if (user === currentUser || !user.isChoice) {
            // 排除掉自己和不能操作的
            return
          }
          // 服务时间冲突
          // 同一个人，在不同场地，不一定都冲突，在场地A的时间与在场地B的时间有叠加，不代表在场地A的时间与在场地C的时间有叠加，所以要区分开
          if (
            (platform.startTime < currentPlatform.startTime && platform.endTime > currentPlatform.startTime) ||
            (platform.endTime > currentPlatform.endTime && platform.startTime < currentPlatform.endTime) ||
            (platform.endTime > currentPlatform.endTime && platform.startTime < currentPlatform.startTime) ||
            (platform.endTime < currentPlatform.endTime && platform.startTime > currentPlatform.startTime) ||
            (platform.endTime === currentPlatform.endTime && platform.startTime >= currentPlatform.startTime) ||
            (platform.endTime <= currentPlatform.endTime && platform.startTime === currentPlatform.startTime)
          ) {
            // 与当前platform冲突的人
            if (currentUser.sysUserId === user.sysUserId && currentUser.careerId === user.careerId) {
              user.conflictPlatformIds = user.conflictPlatformIds || [] // 冲突的场地id
              if (currentUser.isSelected) {
                // 当前是勾选
                user.conflictPlatformIds.push(platform.platformId)
              } else {
                // 当前是去勾选
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
        all.push(
          new Promise((resolve, reject) => {
            form.validate(valid => {
              if (valid) {
                resolve()
              } else {
                reject(new Error())
              }
            })
          })
        )
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
            this.serverData.dealPlatformList.forEach(function (platform) {
              platform.sportPlatformUserList.forEach(function (user) {
                if (user.isSelected) {
                  list.push({
                    careerId: user.careerId,
                    platformId: platform.platformId,
                    platformUserId: user.platformUserId,
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
          this.$router.push(`/pay/${data}`)
        })
      }).catch(e => {
        popup.alert('请完善表单项后再试')
      })
    },
    addNewTeam(dealPlatform) {
      popup.prompt('请填写团队名称').then(result => {
        const teamName = result.value || ''
        if (teamName.length === 0) {
          popup.alert('请填写团队名称')
          return
        }
        if ((this.serverData.sportTeamList || []).some(team => {
          return team.sportName === teamName
        })) {
          popup.alert('已存在此名称的团队，请更换名称再试')
          return
        }
        this.$http.post('/sportPlatformTeam/add.do', {
          teamName,
          professionalId: dealPlatform.professionalId
        }).then(data => {
          data = data || {}
          popup.alert('创建成功')
          this.serverData.sportTeamList = this.serverData.sportTeamList || []
          this.serverData.sportTeamList.push({
            professionalId: data.professionalId,
            sportName: data.name,
            sportTeamId: data.id
          })
        })
      })
    }
  },
  computed: {
    platformTotalPrice() {
      return this.serverData.dealPlatformList.reduce((prev, platform) => {
        return math.add(prev, platform.platformPrice || 0)
      }, 0)
    },
    totalPrice() {
      let price = this.platformTotalPrice
      this.serverData.dealPlatformList.forEach(function (platform) {
        platform.sportPlatformUserList.forEach(function (user) {
          if (user.isSelected) {
            price = math.add(price, user.servicePrice || 0)
          }
        })
      })
      return price
    }
  },
  data() {
    return {
      rules: {
        sportTeamId: [
          {
            type: 'number',
            required: true,
            message: '请选择约战团队',
            trigger: 'change'
          }
        ],
        sportTeamColor: [
          {
            required: true,
            message: '请选择队服颜色'
          }
        ],
        fightMobile: [
          {
            required: true,
            message: '请填写团队联系方式',
            trigger: 'blur'
          }
        ],
        fightDeclaration: [
          {
            required: true,
            message: '请填写团队约战备注',
            trigger: 'blur'
          }
        ]
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
      platformCache: this.$webStore.session.get('platform_cache'),
      salesId: this.$route.params['id'],
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-service-user`
    }
  }
}
</script>

<style lang="scss">
.team-addnew {
  .el-button {
    padding: 0 3.5px;
    font-size: 14px;
  }
}
</style>

<style lang="scss" scoped>
.container {
  .item-one {
    .item-title {
      color: #222;
      padding-bottom: 15px;
      border-bottom: 1px solid #f0f0f0;
    }
    .item-content + .item-title,
    .item-content {
      padding-top: 15px;
      > div {
        padding: 3px 0;
      }
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
        opacity: 0.5;
      }
      .user-item.selected {
        border-color: #f52;
      }
      .price {
        color: #f26a3e;
        padding: 0 3px;
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
        font-size: 14px;
        .money,
        .btn {
          padding: 10px 0;
        }
        .money {
          span {
            color: #ff5e20;
            font-size: 22px;
          }
        }
        .btn {
          background-color: #ff5e20;
          color: white;
          line-height: 25px;
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

