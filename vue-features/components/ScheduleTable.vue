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
          <tr v-for="(level, j) in columns" :key="j">
            <th v-for="(col, i) in level" :key="col.platformId" :colspan="col.subCount || 1" :class="`schedule-table_column_${i + 1}`">
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
            <td v-for="(col, i) in cols" :key="col.prop" colspan="1" rowspan="1" :class="`schedule-table_column_${i + 1}`">
              <div class="table-cell">123</div>
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
export default {
  props: {
    data: {
      type: Object,
      default: {}
    },
    maxHeight: Number
  },
  mounted() {
    if (process.browser) {
      this.$nextTick().then(() => {
        const bodyWrapper = this.$refs['body-wrapper']
        // if (bodyWrapper.scrollWidth > bodyWrapper.clientWidth) { // 有横向滚动
        const headerWrapper = this.$refs['header-wrapper']
        bodyWrapper.addEventListener('scroll', function() {
          headerWrapper.scrollLeft = this.scrollLeft
        })
        // }
      })
    }
  },
  methods: {

  },
  computed: {
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
      return tsList.map(row => {
        return new Array(this.colLength).fill({

        })
      })
    }
  },
  watch: {
    data() {
      this.dataCopy = _.cloneDeep(this.data) || {}
    }
  },
  data() {
    return {
      colWidth: 80,
      dataCopy: {}
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
    }
    th {
      background-color: #eef1f6;
    }
    .table-cell {
      word-wrap: normal;
      text-overflow: ellipsis;
      line-height: 30px;
      width: 100%; // padding: 0 15px;
    }
    .schedule-table__empty-text {
      color: #5e7382;
    }
  }
}
</style>
