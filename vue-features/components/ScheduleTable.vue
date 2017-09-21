<template>
  <div class="schedule-table">
    <div class="schedule-table__hidden-columns" ref="hiddenColumns">
      <slot></slot>
    </div>
    <div class="schedule-table__header-wrapper" ref="header-wrapper">
      <table cellspacing="0" cellpadding="0" border="0" class="schedule-table__header" :style="{width: tableWidth + 'px'}">
        <colgroup>
          <col v-for="(col, i) in columns" :key="col.prop" :name="`schedule-table_column_${i + 1}`" :width="col.width">
        </colgroup>
        <thead>
          <tr>
            <th v-for="(col, i) in columns" :key="col.prop" colspan="1" rowspan="1" :class="`schedule-table_column_${i + 1}`">
              <div class="table-cell">{{col.label}}</div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="schedule-table__body-wrapper" ref="body-wrapper" :style="{'max-height': maxHeight ? maxHeight + 'px' : false}">
      <table cellspacing="0" cellpadding="0" border="0" class="schedule-table__body" :style="{width: tableWidth + 'px'}">
        <colgroup>
          <col v-for="(col, i) in columns" :key="col.prop" :name="`schedule-table_column_${i + 1}`" :width="col.width">
        </colgroup>
        <tbody>
          <tr v-for="(item, j) in data" :key="j">
            <td v-for="(col, i) in columns" :key="col.prop" colspan="1" rowspan="1" :class="`schedule-table_column_${i + 1}`">
              <div class="table-cell">{{item[col.prop]}}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    maxHeight: Number
  },
  mounted() {
    this.columns = this.$children.map(child => {
      return {
        label: child.label,
        prop: child.prop,
        width: child.width
      }
    })
    if (process.browser) {
      this.$nextTick(() => {
        const bodyWrapper = this.$refs['body-wrapper']
        if (bodyWrapper.scrollWidth > bodyWrapper.clientWidth) { // 有横向滚动
          const headerWrapper = this.$refs['header-wrapper']
          bodyWrapper.addEventListener('scroll', function() {
            headerWrapper.scrollLeft = this.scrollLeft
          })
        }
      })
    }
  },
  computed: {
    tableWidth() {
      let width = 0
      this.columns.forEach(col => {
        width += +col.width || 0
      })
      return width
    }
  },
  data() {
    return {
      columns: []
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
      width: 100%;
      padding: 0 15px;
    }
  }
}
</style>
