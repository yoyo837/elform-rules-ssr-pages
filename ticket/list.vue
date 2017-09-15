<template lang="pug">
  section.container
    .gap
    .sec
      .sec-title 选择场馆
      ul.sec-content
        li
          el-button(type="primary") 场馆1
    .sec
      .sec-title 选择场次时间
      ul.sec-content
        li
          el-button(type="primary") 场馆1
    .sec
      .sec-title 选择价格
      ul.sec-content
        li
          el-button(type="primary") 场馆1
    .sec
      .sec-content.num-content
        | 数量
        el-input-number(v-model="num", :min="1", :max="10")
        | (剩余
        span 6
        | 张)

    .fixed-bt
      el-row
        el-col(:span="12", class="money") 共计0元
        el-col(:span="12", class="btn") 去支付
</template>

<script>
import Vue from 'vue'
import { Row, Col, Button, InputNumber } from 'element-ui'
import bdStyleMixin, { DefaultConfig } from '../vue-features/mixins/body-style'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)
Vue.component(InputNumber.name, InputNumber)

export default {
  mixins: [bdStyleMixin],
  data() {
    return {
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-ticket-list`,
      num: 1
    }
  }
}
</script>

<style lang="scss">
body.bd-pt-ticket-list {
  padding-bottom: 50px;
}
</style>


<style lang="scss" scoped>
$padding: 10px;
.container {
  .gap {
    height: 15px;
    background-color: white;
  }
  .sec {
    .sec-title {
      color: #777;
      font-size: 14px;
      height: 26px;
      line-height: 26px;
      padding: 0 $padding;
    }
    .sec-content {
      margin: 0;
      padding: $padding;
      list-style-type: none;
      background-color: white;
    }
    .num-content {
      border-top: 1px solid #eee;
      .el-input-number {
        margin: 0 5px;
      }
      .el-input-number+span {
        color: #FF5E20;
      }
    }
  }
  .fixed-bt {
    background-color: white;
    padding: 0;
    .el-row {
      .el-col {
        padding: 15px 0;
        color: #FF5E20;
        font-size: 14px;
      }
      .el-col.btn {
        background-color: #FF5E20;
        color: white;
      }
    }
  }
}
</style>
