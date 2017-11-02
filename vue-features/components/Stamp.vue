<template>
  <div class="stamp" :class="{'stamp-disable' : checkState && data.state != 0}">
    <div class="stamp-header">
      <div class="stamp-title text-overflow" :title="data.serviceName">
        {{data.serviceName}}
      </div>
      <el-row>
        <el-col :span="18" class="text-overflow">
          {{data.descr}}
        </el-col>
        <el-col :span="6" class="text-overflow text-right">
          {{data.serviceTag}}
        </el-col>
      </el-row>
    </div>
    <div class="stamp-body">
      <div class="text-overflow-line3 stamp-detail">
        <template v-for="item in data.pubServiceDataList">
          <template v-for="subItem in item.pubServiceValue" v-if="subItem.commonCalendar && subItem.commonCalendar.weekDate">
            <div :key="subItem.serviceDataId">
              <template v-if="item.serviceObj == 37">
                场地
              </template>
              <template v-else-if="item.serviceObj == 1">
                人员
              </template>
              <template v-else-if="item.serviceObj == 6">
                商品
              </template>
              {{resolveWeekDays(subItem.commonCalendar.weekDate)}} {{subItem.commonCalendar.startTimeValue}}-{{subItem.commonCalendar.endTimeValue}}
              <template v-if="subItem.serviceType == 1">
                {{formatMoney(subItem.serviceValue, 1)}} 折
              </template>
              <template v-else-if="item.serviceType == 2">
                {{subItem.serviceValue}}
                <template v-if="subItem.unit == 1">
                  次
                </template>
                <template v-else-if="subItem.unit == 2">
                  小时
                </template>
              </template>
              <template v-else-if="item.serviceType == 3">
                <template v-if="subItem.unit == 1">
                  每次
                </template>
                <template v-else-if="subItem.unit == 2">
                  每小时
                </template>
                {{subItem.serviceValue}} 元
              </template>
              优惠
            </div>
          </template>
        </template>
      </div>
      <el-row>
        <el-col :span="18" class="text-overflow highlight">
          有效期
          <template v-if="data.startDate">
            {{formatDate(data.startDate)}}至{{formatDate(data.endDate)}}
          </template>
          <template>
            不限
          </template>
        </el-col>
        <el-col :span="6" class="text-overflow highlight text-right">
          ￥{{formatMoney(data.serviceAmount)}}
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Row, Col } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    checkState: Boolean
  },
  methods: {
    resolveWeekDays(commonCalendar) {
      if (commonCalendar == null) {
        return null
      }

      const html = []

      // 解析连续的天
      const resolve = weekDays => {
        let from = 0
        let end = 0
        weekDays.some((wd, i) => {
          if (i === weekDays.length - 1 || +wd + 1 === +weekDays[i + 1]) { // 符合要求
            end = i
            return false // 继续找
          }
          return true
        })
        if (html.length) {
          html.push(',')
        }
        if (end === 0) {
          html.push(`${this.weekDays[weekDays[0]]}`)
        } else {
          html.push(`${this.weekDays[weekDays[from]]}至${this.weekDays[weekDays[end]]}`)
        }
        weekDays.splice(0, end + 1)
        if (weekDays.length) {
          resolve(weekDays)
        }
      }

      resolve(commonCalendar.trim().split(',').filter(wd => {
        return +wd === parseInt(wd)
      }))

      return html.join('')
    }
  },
  data() {
    return {
      weekDays: {
        '1': '星期一',
        '2': '星期二',
        '3': '星期三',
        '4': '星期四',
        '5': '星期五',
        '6': '星期六',
        '7': '星期日',
        '8': '法定工作日',
        '9': '法定节假日'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
  text-align: left;
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
  &.stamp-disable {
    background: #d8d8d8;
    background: radial-gradient(transparent 0, transparent 5px, #d8d8d8 0);
    background-size: 15px 15px;
    background-position: 3px 8px;
    .stamp-header {
      background-color: #d8d8d8;
    }
    .stamp-body {
      color: #999;
      border-color: rgba(red(#d8d8d8), green(#d8d8d8), blue(#d8d8d8), 0.5);
    }
    .highlight {
      color: #999;
    }
  }
}
</style>

