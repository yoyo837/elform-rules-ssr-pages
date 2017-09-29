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
          <tr v-for="(cols, j) in viewRows" :key="j">
            <td v-for="(col, i) in cols" v-if="col" :key="col.prop" :colspan="col.colspan || 1" :rowspan="col.rowspan || 1" :class="{[`schedule-table_column_${i + 1}`] : true, disabled : col.expired, 'no-open': col.notYetOpenTimeText, selected : col.selected}" :data-platform-id="col.platformId" @click="onSelect(col)">
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
                  <div v-if="col.showPrice">
                    {{col.priceText}}
                    <template v-if="col.price > 0">
                      元
                    </template>
                    <template v-if="col.ticketInfo">
                      余票 {{col.ticketInfo.surplusNum || 0}}
                    </template>
                  </div>
                </template>
              </div>
            </td>
          </tr>
          <tr v-if="(viewRows == null || viewRows.length == 0) && columns.level1.length">
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
import math from '../../../components/math'
import store from '../../../components/store'
import popup from '../../../components/popup'
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
    /**
     * 转换旧时间(纠正年月日)
     */
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
        return
      }
      if (col.selected) { // 取消选中
        col.selected = false
        this.selectedCols.splice(this.selectedCols.findIndex(item => { // 移除,单个
          return item === col
        }), 1)
      } else { // 选中
        col.selected = true
        this.selectedCols.push(col)
        if (col.freeRange) {
          // 固定时段选啥是啥
        } else {
          let times = col.endTime - col.startTime // 已选时长
          const stepTime = this.dataCopy.everyAddTime // 单场地每步最小选中时间长度
          if (stepTime) { // 设置了stepTime
            let baseStep = 1
            let tempCol = col
            while (times < stepTime) {
              const nRow = this.rows[tempCol.rowIndex + baseStep] // 往后
              let nCol = null
              if (nRow == null || (function() {
                nCol = nRow[col.colIndex]
                return nCol.expired || nCol.freeRange || nCol.selected || nCol.hasBeenSpan // 是固定区间or已被选中or被跨
              }())) { // 末尾了
                if (baseStep < 0) {
                  break
                }
                // 归位反方向
                baseStep = -1
                tempCol = col
                continue
              }
              // console.log(nCol.rowIndex, nCol.colIndex)
              times += nCol.endTime - nCol.startTime
              nCol.selected = true
              tempCol = nCol
            }
          }
        }
      }
    },
    buildColumns() { // 原始数据不在里面关联动态修改内容，避免重复计算
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
    /**
     * 构造行/列
     */
    buildRows() { // 原始数据不在里面关联动态修改内容，避免重复计算, 放computed里updateComponent时会重新触发计算
      const tsList = this.dataCopy.timeSlotList || []
      const platformOrderInfo = this.dataCopy['_platformOrders'] || []
      const rows = []
      tsList.map((slot, rowIndex) => {
        const row = []
        // 先找出当前时段的
        const currentTimeSlotOrders = platformOrderInfo.filter((order) => {
          // 一个order的最小时间区间就是一个slot的区间，所以只会是order的范围大于等于一个slot
          // return slot.startTime <= order.endTime && slot.endTime >= order.startTime;
          return order.startTime <= slot.startTime && order.endTime >= slot.endTime
        })

        // 准备列
        // 先参考第一层
        this.columns.level1.forEach(platform => {
          // 符合当前第一层列头的订单
          // 先找到上层(包括其所有子层的数据,后面每层再顾虑来使用)
          const currentTimeSlotColFstOrders = currentTimeSlotOrders.filter((order) => {
            // 指向第一层时，可能只有一层，也可能是基于第一层依靠platformSubIds指向第二层
            // 订单的数据指向的platformId可能是第一层也可能是第二层
            // if (platform.subZoneCount == 0) {
            if (order.platformId === platform.platformId) {
              return true
            }
            // }
            // 订单的数据有可能是platformId就直接指向具体成，此时的order.platformId不等于platform.id
            // 订单的数据指向的platformId可能是第一层也可能是第二层
            if (order.platformSubIds == null || order.platformSubIds.length === 0) {
              return this.columns.level2.filter(lv => { // 去下层找
                return lv.parentId === platform.platformId && lv.platformId === order.platformId
              }).length > 0
            }
            return false
          })

          // 如果有子层
          if (platform.subCount > 0) {
            // 需要跳过的子id
            const skipSubIds = []

            this.columns.level2.filter(subPlatform => {
              return subPlatform.parentId === platform.platformId
            }).forEach(subPlatform => {
              // 已被合并处理
              if (skipSubIds.includes(subPlatform.platformId)) {
                return
              }

              // 再基于子层过滤
              const currentTimeSlotColSecdOrders = currentTimeSlotColFstOrders.filter(order => {
                if (order.platformId === subPlatform.platformId) {
                  return true
                }
                if (this.isTicket) { // isTicket没有按platformSubIds的方式指定
                  return true
                }
                if (order.platformSubIds) {
                  return order.platformSubIds.split(',').includes(subPlatform.platformId.toString())
                }
                return false
              })

              // 场馆类型的时候通常是互斥的，所以ods最多是1个
              const order = currentTimeSlotColSecdOrders[0]

              const oldLength = skipSubIds.length
              if (order) {
                if (order.platformSubIds) {
                  skipSubIds.push.apply(skipSubIds, order.platformSubIds.split(','))
                } else {
                  skipSubIds.push(order.platformId.toString())
                }
              }

              const colspan = skipSubIds.length - oldLength

              // build
              this.push$fill(row, this.buildRow(rows, order, tsList, slot, rowIndex, row.length, colspan))
            })
          } else {
            // build
            this.push$fill(row, this.buildRow(rows, currentTimeSlotColFstOrders[0], tsList, slot, rowIndex, row.length))
          }
        })
        rows.push(row)
      })
      return rows
    },
    /**
     * 构建单元格信息
     */
    buildRow(rows, orderInfo, allSlots, slotTime, rowIndex, colIndex, colspan) {
      let rowspan = 1
      colspan = colspan || 1

      // 从第一行开始查找前面行的跨行数据
      if (rows.filter((row, i) => { // 过滤一下是因为，避免逻辑调整导致本行整行完成前有可能本行已经添加到rows里了
        return i < rowIndex
      }).some((row, i, list) => {
        // 遍历到的目标行的此列跨行数量+距离本行的行数大于1，说明本行此列被合并了
        const col = row[colIndex]
        if (col == null) {
          return false
        }
        return col.rowspan + i - rowIndex > 0
      })) {
        return null // 此行此列被合并了,一旦发现是被合并的，不再识别此行对象
      }

      let startTime = slotTime.startTime
      let endTime = slotTime.endTime

      // 按照目前的单元格合并方式:
      // 场地有半场的概念的，可能存在横向合并，没有半场概念的只有纵向合并，因为不夸场地合并；
      // 存在横向合并时，有限横向合并，既，是这样的话会打断条件成立的纵向合并；
      // 基于以上两条，不存在同时需要两个方向合并第一个；
      if (colspan < 2 && orderInfo) {
        let currentIndex = rowIndex
        // 先只处理跨行
        while (true) {
          const nextSlot = allSlots[currentIndex + 1]
          if (nextSlot == null) {
            break
          }
          if (nextSlot.endTime <= orderInfo.endTime) { // 跨行
            rowspan++
          }
          currentIndex++
        }
      }

      if (orderInfo) {
        startTime = orderInfo.startTime
        endTime = orderInfo.endTime
      }

      const platformInfo = this.platformInColumns[colIndex]
      const priceBean = this.getPrice(slotTime, platformInfo)
      return {
        rowIndex,
        colIndex,
        hasBeenSpan: false, // 被跨行或者跨列
        startTime: this.changeDayForTimestamp(startTime),
        _startTime: startTime,
        startTimeText: moment(startTime).format('HH:mm'),
        endTime: this.changeDayForTimestamp(endTime),
        _endTime: endTime,
        endTimeText: moment(endTime).format('HH:mm'),
        price: priceBean.price || 0,
        priceText: priceBean.priceValue,
        colspan,
        rowspan,
        showPrice: this.dataCopy.isViewPrice === 0,
        freeRange: slotTime.viewType === 2, // 1=循环时段 2=固定时段
        // 关联数据
        platformInfo
      }
    },
    push$fill(row, col) {
      if (row == null) {
        return
      }
      row.push(col)
      if (col) {
        if (col.colspan > 1) {
          for (let m = 1; m < col.colspan; m++) {
            row.push(null) // 占位
          }
        }
      }
    },
    getPrice(slotTime, platformInfo) {
      if (slotTime == null || platformInfo == null) {
        return {}
      }
      const priceList = this.dataCopy.sportPlatformPriceList
      if (priceList == null || priceList.length === 0) {
        return {}
      }
      return priceList.find(bean => {
        return bean.priceTagId === platformInfo.platformPriceId && bean.startTime <= slotTime.startTime && bean.endTime >= slotTime.endTime
      })
    },
    /**
     * 校验时长等
     */
    check() {
      if (this.selectedCols.length === 0) {
        popup.alert('请先选择场地.')
        return false
      }
      if (this.dataCopy.maxBookTime) { // maxBookTime是校验所有的总时长
        if (this.selectedCols.reduce((prev, col) => {
          return prev + (col.endTime - col.startTime)
        }, 0) > this.dataCopy.maxBookTime) {
          popup.alert(this.dataCopy.maxBookTimeDescr || '超过最大可预订时长限制,请取消部分后再试.')
          return false
        }
      }
      if (this.dataCopy.singleMinBookTime) { // singleMinBookTime是校验单个场地
        const map = {}
        this.selectedCols.filter(col => {
          return !col.freeRange
        }).forEach(col => {
          map[col.colIndex] = map[col.colIndex] || 0
          map[col.colIndex] += col.endTime - col.startTime
        })
        for (var colIndex in map) {
          if (map.hasOwnProperty(colIndex)) {
            if (map[colIndex] < this.dataCopy.singleMinBookTime) { // 不满足时长
              const inColIndexCols = this.rows.map(row => { // 同一个列下
                return row[colIndex]
              }).filter(col => {
                return !(col.expired || col.freeRange || col.hasBeenSpan || col.selected)
              })
              if (inColIndexCols.length) { // 本场地还有空列
                return false
              }
            }
          }
        }
      }
      return true
    },
    cache() {
      if (this.check()) {
        const dt = []
        const buildDealPlatform = (col, allSub) => {
          return {
            platformParentId: allSub ? 0 : col.platformInfo.parentPlatformId,
            platformId: allSub ? col.platformInfo.parentPlatformId : col.platformInfo.platformId,
            orderDate: moment(this.params.dateTime).format('YYYY-MM-DD'),
            startTime: col._startTime,
            endTime: col._endTime,
            colspan: allSub ? col.platformInfo.brother : 1,
            rowspan: 1,
            colIndex: col.colIndex,
            rowIndex: col.rowIndex
          }
        }
        // 由上至下，由左至右, 横向纵向不同时存在合并
        this.selectedCols.sort((col1, col2) => { // 不可能相等
          if (col1.rowIndex < col2.rowIndex) {
            return -1
          }
          if (col1.colIndex < col2.colIndex) {
            return -1
          }
          return 1
        }).forEach(col => { // 遍历已选中的
          const platformParentId = col.platformInfo.parentPlatformId
          const platformId = col.platformInfo.platformId
          const selectBrother = this.selectedCols.filter(innerCol => {
            return innerCol.platformInfo.parentPlatformId === platformParentId && col.rowIndex === innerCol.rowIndex
          })
          if (platformParentId === 0 || selectBrother.length < col.platformInfo.brother) { // 不含子场或者没全选所有子场  // 不横向
            // 找上面的看能不能接上
            if (col.rowIndex === 0) { // 是第一行的
              dt.push(buildDealPlatform(col)) // 直接放
              return
            }
            // 找到本列比当前早的
            const foundCols = dt.filter(dtCol => {
              return dtCol.platformId === platformId && dtCol.colIndex === col.colIndex && dtCol.rowIndex < col.rowIndex
            })

            if (foundCols.length === 0) { // 没有更早的
              dt.push(buildDealPlatform(col)) // 直接放
              return
            }

            const lastColInFound = foundCols[foundCols.length - 1] // 因为是按顺序放的，所以直接拿最后一个来判断
            if (lastColInFound.rowIndex + 1 === col.rowIndex) { // 紧挨着的，纵向合并
              lastColInFound.endTime = col._endTime // 改结束时间
              lastColInFound.rowspan++
              lastColInFound.rowIndex++
              return
            }
            dt.push(buildDealPlatform(col)) // 直接放
          } else { // 横向的全合并
            if (!dt.find(dtCol => {
              return dtCol.platformParentId === 0 && dtCol.platformId === platformParentId && dtCol.rowIndex === col.rowIndex
            })) {
              dt.push(buildDealPlatform(col, true))
            }
          }
        })

        // console.log(dt)
        store.session.put('platform_cache', dt)
        this.$router.push(`/booking/service/${this.params.salesId}`)
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
    colLength() { // 总列数量
      return this.platformInColumns.length
    },
    tableWidth() {
      return this.colLength * this.colWidth
    },
    platformInColumns() { // 准备platform 关键字段数据, 原始数据不在里面关联动态修改内容，避免重复计算
      const platformInColumns = []
      let level2Index = 0
      this.columns.level1.forEach(platform => {
        if (platform.subCount === 0) {
          platformInColumns.push({
            platformId: platform.platformId,
            parentPlatformId: platform.parentId,
            platformPriceId: platform.platformPriceId,
            brother: 1
          })
        } else {
          for (let j = 0; j < platform.subCount; j++) {
            const subPlatform = this.columns.level2[level2Index++]
            platformInColumns.push({
              platformId: subPlatform.platformId,
              parentPlatformId: subPlatform.parentId,
              platformPriceId: platform.platformPriceId,
              brother: platform.subCount
            })
          }
        }
      })
      return platformInColumns
    },
    viewRows() { // 布局用, 可修改, 可维护状态，避免rows重复计算始终生成新的col
      const nowTime = +this.now.format('x')
      this.rows.forEach(row => {
        row.forEach((col, j) => {
          if (col == null) {
            return
          }
          col.expired = col.endTime < nowTime
          if (this.isTicket) {
            col.ticketInfo = (this.dataCopy['_ticketStatus'] || [])[j] || {}
          }
          if (this.dataCopy.bookStartTime && this.dataCopy.bookStartTime > nowTime) {
            const mmt = moment(this.dataCopy.bookStartTime)
            col.notYetOpenTimeText = mmt.format('MM月DD日HH点mm分')
          }
        })
      })
      return this.rows
    }
  },
  watch: {
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
            // test
            // platformData.everyAddTime = 1800000 * 2
            platformData.maxBookTime = 0
            // platformData.singleMinBookTime = 1800000 * 7

            _.assign(platformData, {
              [this.isTicket ? '_ticketStatus' : '_platformOrders']: orderData
            })

            _.assign(this.serverData, platformData)

            this.dataCopy = _.cloneDeep(this.serverData)

            this.columns = this.buildColumns() || {}

            this.rows = this.buildRows() || []

            const hd = this.$refs['header-wrapper']

            this.$nextTick().then(() => {
              this.$emit('dataReload', {
                salesName: this.dataCopy.salesName,
                marqueeText: this.dataCopy.bookAlert,
                headerHeight: Math.max(hd.offsetHeight, hd.clientHeight)
              })
            })
          })
        })
      }
    },
    rows() {
      this.selectedCols.splice(0, this.selectedCols.length) // 清空
    },
    selectedCols() { // 汇总价格
      let price = 0
      this.selectedCols.forEach(col => {
        price = math.add(price, col.price)
      })
      this.$emit('priceReload', price)
    }
  },
  data() {
    return {
      timerSwitch: true,
      colWidth: 80,
      columns: {
        level1: [],
        level2: []
      },
      rows: [],
      serverData: {},
      dataCopy: {},
      now: moment(),
      selectedCols: []
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
    table {
      tr {
        &:hover {
          td {
            background-color: #eef1f6;
            background-clip: padding-box;
          }
        }
      }
    }
  }
  .schedule-table__header-wrapper,
  .schedule-table__body-wrapper {
    table {
      table-layout: fixed;
      tr {
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
        } // td.no-open,
        // th.no-open {
        //   .not-yet-open-time {
        //     color: #999;
        //   }
        // }
        td.selected,
        th.selected {
          background-color: #20a0ff;
          color: white;
        }
        .schedule-table__empty-text {
          color: #5e7382;
        }
      }
    }
  }
}
</style>
