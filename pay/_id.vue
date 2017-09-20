<template>
  <section class="container">
    支付{{dealId}}
    <div class="fixed-bt">
      <el-row>
        <el-col :span="16">
          <div class="money">
            共计{{serverData.totalPrice}}元
          </div>
        </el-col>
        <el-col :span="8">
          <div class="btn" @click="toPay">支付</div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { Row, Col, Button } from 'element-ui'
import bdStyleMixin, { DefaultConfig } from '../vue-features/mixins/body-style'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  mixins: [bdStyleMixin],
  methods: {
    toPay() {
      this.$wxConfig(true).then(data => {
        alert(JSON.stringify(data))
      })
    }
  },
  data() {
    return {
      serverData: {

      },
      bodyClass: `${DefaultConfig.bodyClass} bd-pt-pay`,
      dealId: this.$route.params['id']
    }
  }
}
</script>

<style lang="scss">
body.bd-pt-pay {
  padding-bottom: 60px;
}
</style>

<style lang="scss" scoped>
.container {
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

