<template>
  <mt-index-list class="index-list-box" :height="wrapperHeight" ref="box">
    <mt-index-section v-for="(list, key) in indexMap" :index="key" :key="key">
      <Card :mini="true">
        <div v-for="member in list" :key="member.pubAccountId" class="list-member" @click="onSelect(member)">
          <img :src="`${member.avatar}60X60.jpg`" class="member-avatar">
          <div class="member-name">{{member.realName}}</div>
          <div class="member-gender">
            <i class="fa fa-id-card" aria-hidden="true"></i>
          </div>
        </div>
      </Card>
    </mt-index-section>
  </mt-index-list>
</template>

<script>
import Vue from 'vue'
// import { IndexList, IndexSection, Cell } from 'mint-ui'
import Card from './Card'
import { IndexList, IndexSection } from 'mint-ui'

// Vue.component(Cell.name, Cell)
Vue.component(IndexList.name, IndexList)
Vue.component(IndexSection.name, IndexSection)

export default {
  props: {
    dataList: {
      type: Array,
      default: []
    }
  },
  components: {
    Card
  },
  methods: {
    onSelect(member) {
      this.$emit('onSelect', member)
    }
  },
  computed: {
    wrapperHeight() {
      if (this.dataList == null || this.dataList.length === 0) {
        return null
      }
      const box = this.$refs['box'].$el
      return (
        document.documentElement.clientHeight -
        box.getBoundingClientRect().top -
        window.parseFloat(window.getComputedStyle(box).marginTop) -
        2
      )
    },
    indexMap() {
      this.dataList.sort((item1, item2) => {
        const val1 = item1.namePinyin || ''
        const val2 = item2.namePinyin || ''
        // 获取较长的拼音的长度
        const length = val1.length > val2.length ? val1.length : val2.length

        // 依次比较字母的unicode码，相等时返回0，小于时返回-1，大于时返回1
        let i = 0
        for (; i < length; i++) {
          const differ = val1.charCodeAt(i) - val2.charCodeAt(i)
          if (differ === 0) {
            continue
          } else {
            if (val1.charAt(i) === '_') {
              return -1
            }
            return differ
          }
        }
        if (i === length) {
          return val1.length - val2.length
        }
      })

      // 先分类
      const map = {}
      this.dataList.forEach(mem => {
        const indexKey = mem.namePinyin.substr(0, 1)
        let list = map[indexKey]
        if (list == null) {
          list = []
          map[indexKey] = list
        }
        list.push(mem)
      })

      return map
    }
  }
}
</script>

<style lang="scss" scoped>
.index-list-box {
  .list-member {
    padding: 15px;
    .member-avatar {
      border-radius: 50%;
      vertical-align: middle;
      height: 50px;
      width: 50px;
    }
    .member-name,
    .member-gender {
      display: inline-block;
      padding-left: 8px;
    }
    .member-name {
      color: #222;
    }
  }
  .list-member + .list-member {
    border-top: 1px solid #f0f0f0;
  }
}
</style>
