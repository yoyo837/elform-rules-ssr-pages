<template>
  <section class="container">
    <div class="ohters">
      <el-row>
        <el-col :span="21">
          <Slider :data-list="serverData.itemDataList" idkey="itemId" label="itemIdValue" type="item" v-model="itemId"></Slider>
        </el-col>
        <el-col :span="3" class="text-center">
          <nuxt-link to="/user/my">
            <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/m_zh1.png`" class="user-icon">
          </nuxt-link>
        </el-col>
      </el-row>
      <Slider :data-list="serverData.dateDataList" idkey="day" label="dayName" label2="weekName" type="datetime" v-model="curDate"></Slider>
      <div class="marquee-box" v-if="marqueeText && marqueeText.trim().length">
        <div class="marquee" :style="{left: marqueeLeft + 'px'}">
          {{marqueeText}}
        </div>
      </div>
    </div>
    <ScheduleTable :data="serverData.tableData" :max-height="tableMaxHeight" style="margin: 10px 0">
      <ScheduleTableColumn prop="abc0" width="100" label="abc0"></ScheduleTableColumn>
      <ScheduleTableColumn prop="abc1" width="100" label="abc0"></ScheduleTableColumn>
      <ScheduleTableColumn prop="abc2" width="100" label="abc0"></ScheduleTableColumn>
      <ScheduleTableColumn prop="abc2" width="100" label="abc0"></ScheduleTableColumn>
      <ScheduleTableColumn prop="abc2" width="100" label="abc0"></ScheduleTableColumn>
      <ScheduleTableColumn prop="abc2" width="100" label="abc0"></ScheduleTableColumn>
    </ScheduleTable>
    <el-table :data="serverData.tableData" border :max-height="tableMaxHeight">
      <el-table-column prop="date" label="日期" width="100"></el-table-column>
      <el-table-column prop="date1" label="日期" width="100"></el-table-column>
      <el-table-column prop="date2" label="日期" width="100"></el-table-column>
      <el-table-column prop="date3" label="日期" width="100"></el-table-column>
      <el-table-column prop="date4" label="日期" width="100"></el-table-column>
    </el-table>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import utils from '../../../components/utils'
import Slider from '../../vue-features/components/Slider'
import ScheduleTable from '../../vue-features/components/ScheduleTable'
import ScheduleTableColumn from '../../vue-features/components/ScheduleTableColumn'
import { Row, Col, Table, TableColumn } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  head() {
    return {
      title: '预定'
    }
  },
  components: {
    Slider,
    ScheduleTable,
    ScheduleTableColumn
  },
  mounted() {
    this.$http.get('/sportPlatform/querySalesItemList.do', {
      salesId: this.salesId
    }).then(data => {
      _.assign(this.serverData, {
        itemDataList: data || []
      })
    })
    this.mq()
  },
  beforeDestroy() {
    this.marquee = false
  },
  methods: {
    mq() {
      if (this.marquee) {
        if (this.marqueeLeft < -1500) {
          this.marqueeLeft = utils.screenSize().width + 30
        }
        this.marqueeLeft = this.marqueeLeft - 3
        setTimeout(this.mq, 30)
      }
    }
  },
  computed: {
    tableMaxHeight() {
      // return utils.screenSize().height -
      return 150
    }
  },
  watch: {
    itemId(val, oldVal) {
      if (this.itemId) {
        const itemObj = this.serverData.itemDataList.find(item => {
          return item.itemId === this.itemId
        })
        this.$http.get('/sportPlatform/queryCalendarList.do', {
          salesId: this.salesId,
          itemId: this.itemId
        }).then(data => {
          _.assign(this.serverData, {
            dateDataList: data || []
          })

          if (itemObj.itemType === 1) {
            // this.$http.get('/sportPlatform/querySportPlatformInfo.do', {
            //   salesId: this.salesId,
            //   itemId: this.itemId,
            //   curDate: this.curDate.getTime()
            // }).then(data => {

            // })
          } else if (itemObj.itemType === 2) {
            // this.$http.get('/ticket/queryScheduleInfo.do', {
            //   dataId
            // }).then(data => {

            // })
          }
        })
      }
    }
  },
  data() {
    return {
      marquee: true,
      marqueeLeft: 100,
      marqueeText: '巴拉巴宝莉第三方士大夫第三方士大夫士大夫第三方第三方第三方多少巴拉巴宝莉第三方士大夫第三方士大夫士大夫第三方第三方第三方多少',
      serverData: {
        itemDataList: [],
        dateDataList: [],
        tableData: [{}, {}, {}, {}, {}, {}]
      },
      salesId: this.$route.params['id'],
      itemId: null,
      curDate: null
    }
  }
}
</script>

<style lang="scss" scoped>
.user-icon {
  width: 26px;
  margin-top: 7px;
}

.marquee-box {
  overflow: hidden;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  color: white;
  background-color: #dc9811;
  margin: 0 5px;
  position: relative;
  .marquee {
    width: 1500px;
    position: absolute;
  }
}
</style>
