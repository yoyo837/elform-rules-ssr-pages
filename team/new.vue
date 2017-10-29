<template>
  <section class="container container-pd">
    <el-row :gutter="6">
      <el-col :span="12" v-for="item in serverData" :key="item.key" class="category-item">
        <Card :mini="true" @click.native="onSelect(item.key)">
          <div class="category-item__content">
            <img :src="`${CDN_STATIC_HOST}/themes/mobile/blue/images/xicon_${item.key}.png`">
            <span>{{item.value}}</span>
          </div>
        </Card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
// import _ from 'lodash'
import Vue from 'vue'
import popop from '../../components/popup'
import { Row, Col, Button } from 'element-ui'
import bdStyleMixin from '../vue-features/mixins/body-style'
import Card from '../vue-features/components/Card'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button)

export default {
  head() {
    return {
      title: '创建团队'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    Card
  },
  mounted() {
    this.$http.get('/team/teamProfessionalList.do').then(data => {
      this.serverData.splice(0, this.serverData.length)
      this.serverData.push.apply(this.serverData, data || [])

      if (this.defaultKey) {
        this.onSelect(this.defaultKey)
      }
    })
  },
  methods: {
    onSelect(key) {
      this.$http.get('/team/checkNeedAddInfo.do', { professionalId: key }).then(data => {
        if (data && data.pageTag === 'needAddInfo') {
          popop.alert(`${data.pageTagMsg || 'needAddInfo'} 跳转中...`, {
            callback: () => {
              this.$router.push(`/user/profile?key=${key}`)
            }
          })
          return
        }
        this.$router.push(`/team/edit?key=${key}`)
      })
    }
  },
  data() {
    return {
      serverData: [],
      defaultKey: this.$route.query['key']
    }
  }
}
</script>

<style lang="scss" scoped>
.category-item {
  padding: 3px 0;
  .category-item__content {
    padding: 10px 20px;
    img {
      height: 24px;
      width: 24px;
      vertical-align: middle;
    }
    span {
      padding-left: 20px;
    }
  }
}
</style>
