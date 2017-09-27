<template>
  <div class="schedule-table text-center">
    <div class="schedule-table__hidden-columns" ref="hiddenColumns">
      <!-- <slot></slot> -->
    </div>
    <div class="schedule-table__header-wrapper" ref="header-wrapper">
      <table cellspacing="0" cellpadding="0" border="0" class="schedule-table__header" :style="{width: tableWidth + 'px'}">
        <colgroup>
          <col v-for="(col, i) in columns.level1" :key="col.platformId" :span="col.subCount || 1" :width="colWidth" :name="`schedule-table_column_${i + 1}`">
        </colgroup>
        <thead>
          <tr v-for="(level, key, j) in columns" :key="key">
            <th v-for="(col, i) in level" :key="col.platformId" :colspan="col.subCount || 1" :rowspan="j == 0 && col.subCount == 0 && columns.level2 && columns.level2.length ? 2 : 1" :class="`schedule-table_column_${i + 1}`" :data-platform-id="col.platformId">
              <div class="table-cell">{{col.platformName}}</div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="schedule-table__body-wrapper" ref="body-wrapper" :style="{'max-height': maxHeight ? maxHeight + 'px' : false}">
      <table cellspacing="0" cellpadding="0" border="0" class="schedule-table__body" :style="{width: tableWidth + 'px'}">
        <colgroup>
          <col v-for="(col, i) in columns.level1" :key="col.platformId" :span="col.subCount || 1" :width="colWidth" :name="`schedule-table_column_${i + 1}`">
        </colgroup>
        <tbody>
          <tr v-for="(cols, j) in rows" :key="j">
            <td v-for="(col, i) in cols" :key="col.prop" :colspan="col.colspan || 1" :rowspan="col.rowspan || 1" :class="{[`schedule-table_column_${i + 1}`] : true, disabled : col.expired, 'no-open': col.notYetOpenTimeText, selected : col.selected}" :data-platform-id="col.platformId" @click="onSelect(col)">
              <div class="table-cell">
                <template v-if="col.startTimeText || col.endTimeText">
                  {{col.startTimeText}}-{{col.endTimeText}}
                </template>
                <template v-if="col.expired">
                  <div>已过期</div>
                </template>
                <template v-else-if="col.notYetOpenTimeText">
                  <div class="not-yet-open-time">{{col.notYetOpenTimeText}}开售</div>
                </template>
                <template v-else>
                  <div>
                    {{col.priceText}}
                    <template v-if="col.price > 0">
                      元
                    </template>
                    <template v-if="params.itemType == 2">
                      余票 {{col.ticketInfo.surplusNum || 0}}
                    </template>
                  </div>
                </template>
              </div>
            </td>
          </tr>
          <tr v-if="(rows == null || rows.length == 0) && columns.level1.length">
            <td :colspan="colLength" class="text-center schedule-table__empty-text">
              暂无数据
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { throttle } from 'throttle-debounce'
export default {
  props: {
    params: {
      type: Object,
      required: true
    },
    maxHeight: Number
  },
  mounted() {
    if (process.browser) {
      this.$nextTick().then(() => {
        const bodyWrapper = this.$refs['body-wrapper']
        // if (bodyWrapper.scrollWidth > bodyWrapper.clientWidth) { // 有横向滚动
        bodyWrapper && bodyWrapper.addEventListener('scroll', this.tableScrollFn)
        // }
      })
      this.mq()
    }
  },
  methods: {
    tableScrollFn: throttle(5, function() {
      const headerWrapper = this.$refs['header-wrapper']
      const bodyWrapper = this.$refs['body-wrapper']
      headerWrapper.scrollLeft = bodyWrapper.scrollLeft
    }),
    mq() { // 刷新当前时间
      this.now = moment()
      if (this.timerSwitch) {
        setTimeout(this.mq, 1000 * 1)
      }
    },
    changeDayForTimestamp(long) { // 服务器端的startTime和endTime始终是2013年，只有时分秒是正确的
      let mmt = null
      if (long instanceof moment) {
        mmt = long
      }
      if (_.isNumber(long)) {
        mmt = moment(long)
      }
      if (mmt instanceof moment) {
        const newMmt = moment(this.params.dateTime)
        newMmt.hour(mmt.hour()).minute(mmt.minute()).second(mmt.second()).millisecond(mmt.millisecond())
        return +newMmt.format('x')
      }
      return long
    },
    onSelect(col) {
      if (col.expired) {
        // return
      }
    }
  },
  computed: {
    isTicket() {
      return this.params.itemType === 2
    },
    scheduleLoadFlag() {
      const str = `${this.params.salesId || 0}-${this.params.itemId || 0}-${this.params.dateTime || 0}`
      if (typeof btoa === 'function') {
        return btoa(str)
      }
      return str
    },
    columns() {
      let level2Temp = []
      const config = {
        level1: [],
        level2: []
      }
      const plist = this.dataCopy.sportPlatformList || []
      plist.map(item => {
        if (item.parentId === 0) {
          config.level1.push(item)
        } else {
          level2Temp.push(item)
        }
      })
      config.level1.forEach(item => {
        const other = []
        item.subCount = 0
        level2Temp.forEach(function(subItem) {
          if (subItem.parentId === item.platformId) {
            subItem.parentPlatformName = item.platformName // 关联冗余字段,后台未提供，方便后面使用
            item.subCount++
            config.level2.push(subItem)
          } else {
            other.push(subItem)
          }
        })
        level2Temp = other
      })

      return config
    },
    platformInColumns() { // 准备platform 关键字段数据
      if (this.columns.level2.length === 0) {
        return this.columns.level1.map(platform => {
          return {
            platformId: platform.platformId,
            parentPlatformId: platform.parentId
          }
        })
      }
      const platformInColumns = []
      let level2Index = 0
      this.columns.level1.forEach(platform => {
        if (platform.subCount === 0) {
          platformInColumns.push({
            platformId: platform.platformId,
            parentPlatformId: platform.parentId
          })
        } else {
          for (let j = 0; j < platform.subCount; j++) {
            const platform = this.columns.level2[level2Index++]
            platformInColumns.push({
              platformId: platform.platformId,
              parentPlatformId: platform.parentId
            })
          }
        }
      })
      return platformInColumns
    },
    colLength() { // 总列数量
      let length = 0
      this.columns.level1.forEach(col => {
        length += col.subCount || 1
      })
      return length
    },
    tableWidth() {
      return this.colLength * this.colWidth
    },
    rows() {
      const tsList = this.dataCopy.timeSlotList || []
      const nowTime = +this.now.format('x')
      return tsList.map((slotTime, i) => {
        const row = []
        for (let j = 0; j < this.colLength; j++) {
          const platformInfo = this.platformInColumns[j]
          const col = {
            startTime: this.changeDayForTimestamp(slotTime.startTime),
            startTimeText: slotTime.startTimeValue,
            endTime: this.changeDayForTimestamp(slotTime.endTime),
            endTimeText: slotTime.endTimeValue,
            price: slotTime.price || 0,
            priceText: slotTime.priceValue,
            colspan: 1,
            rowspan: 1,
            // 关联数据
            platformInfo
          }
          col.expired = col.endTime < nowTime
          if (this.isTicket) {
            col.ticketInfo = (this.dataCopy['_ticketStatus'] || [])[j] || {}
          }
          if (this.dataCopy.bookStartTime && this.dataCopy.bookStartTime > nowTime) {
            const mmt = moment(this.dataCopy.bookStartTime)
            col.notYetOpenTimeText = mmt.format('MM月DD日HH点mm分')
          }
          row.push(col)
        }
        return row
      })
    }
  },
  watch: {
    // platformInColumns() {
    //   console.log(this.platformInColumns)
    // },
    scheduleLoadFlag(val, oldVal) {
      if (this.params.dateTime) {
        this.$nextTick().then(() => {
          const params = {
            salesId: this.params.salesId,
            itemId: this.params.itemId,
            curDate: this.params.dateTime
          }
          Promise.all([this.$http.get('/sportPlatform/querySportPlatformInfo.do', params), this.isTicket
            ? this.$http.get('/sportPlatformTicket/queryTicketList.do', params)
            : this.$http.get('/deal/queryDealMiniInfo.do', params)
          ]).then((dataList) => {
            const platformData = dataList[0] || {}
            const orderData = dataList[1] || []

            _.assign(platformData, {
              [this.isTicket ? '_ticketStatus' : '_platformOrders']: orderData
            })

            _.assign(this.serverData, {
              tableData: platformData
            })

            this.dataCopy = _.cloneDeep(this.serverData.tableData)

            this.$emit('dataReload', {
              salesName: this.dataCopy.salesName,
              marqueeText: this.dataCopy.bookAlert
            })
          })
        })
      }
    }
  },
  data() {
    return {
      timerSwitch: true,
      colWidth: 80,
      serverData: {
        tableData: null
      },
      dataCopy: {},
      now: moment()
    }
  },
  destroyed() {
    this.timerSwitch = false
    if (process.browser) {
      if (this.tableScrollFn) {
        const bodyWrapper = this.$refs['body-wrapper']
        bodyWrapper && bodyWrapper.removeEventListener('scroll', this.tableScrollFn)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.schedule-table {
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  background-color: #fff;
  border: 1px solid #dfe6ec;
  font-size: 14px;
  color: #1f2d3d;
  .schedule-table__hidden-columns {
    position: absolute;
    z-index: -1;
  }
  .schedule-table__header-wrapper,
  .schedule-table__body-wrapper {
    width: 100%;
    position: relative;
  }
  .schedule-table__header-wrapper {
    overflow: hidden;
  }
  .schedule-table__body-wrapper {
    overflow: auto;
    .schedule-table__body {
      tr {
        &:hover>td {
          background-color: #eef1f6;
          background-clip: padding-box;
        }
      }
    }
  }
  table {
    table-layout: fixed;
    td,
    th {
      height: 40px;
      min-width: 0;
      text-overflow: ellipsis;
      vertical-align: middle;
      border-bottom: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      .table-cell {
        word-wrap: normal;
        text-overflow: ellipsis;
        line-height: 22px;
        width: 100%; // padding: 0 15px;
      }
    }
    th {
      background-color: #eef1f6;
    }
    td {
      .table-cell {
        font-size: 12px;
      }
    }
    td.disabled,
    th.disabled,
    td.no-open,
    th.no-open {
      color: #9c9c9c;
    }
    // td.no-open,
    // th.no-open {
    //   .not-yet-open-time {
    //     color: #999;
    //   }
    // }
    .schedule-table__empty-text {
      color: #5e7382;
    }
  }
}
</style>
