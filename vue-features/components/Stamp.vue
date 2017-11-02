<template>
  <div class="stamp">
    <div class="stamp-header">
      <div class="stamp-title text-overflow" :title="data.serviceName">
        {{data.serviceName}}
      </div>
      <el-row>
        <el-col :span="18" class="text-overflow">
          简介
        </el-col>
        <el-col :span="6" class="text-overflow text-right">
          券类型
        </el-col>
      </el-row>
    </div>
    <div class="stamp-body">
      <div class="text-overflow-line3 stamp-detail" :title="data.dataContent">
        {{data.dataContent}}
      </div>
      <el-row>
        <el-col :span="18" class="text-overflow highlight">
          有效期{{formatDate(data.startDate)}}至{{formatDate(data.endDate)}}
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
    }
  },
  methods: {
    resolveHtmlWithDataList() {
      // (this.data.pubServiceDataList || []).forEach(item => {

      // })
    }
  },
  data() {
    return {
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
}
</style>

