<template>
  <section class="container">
    <ProfilePanel :pic-path="serverData.picPath" type="team" size="small">
      <template slot="left">{{serverData.count}}人</template>
      <template>{{serverData.teamInfo.teamName || '&nbsp;'}}</template>
      <template slot="right">
        <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/icont_1.png`" class="team-flag"> 团号{{teamid}}
      </template>
    </ProfilePanel>
    <mt-index-list>
      <mt-index-section v-for="(list, key) in serverData.indexMap" :index="key" :key="key">
        <nuxt-link v-for="member in list" :key="member.pubAccountId" :to="`/user/profile?accountid=${member.pubAccountId}&teamid=${teamid}`">
          <mt-cell :title="member.realName">
            <span>{{member.gender == 1 ? '男' : '女'}}</span>
            <img slot="icon" :src="`${member.avatar || defaultTeamImg}60X60.jpg`" class="index-list-avatar">
          </mt-cell>
        </nuxt-link>
      </mt-index-section>
    </mt-index-list>
  </section>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import utils from '../../components/utils'
import { IndexList, IndexSection, Cell } from 'mint-ui'
import ProfilePanel from '../vue-features/components/ProfilePanel'

Vue.component(IndexList.name, IndexList)
Vue.component(IndexSection.name, IndexSection)
Vue.component(Cell.name, Cell)

export default {
  components: {
    ProfilePanel
  },
  created() {
    this.$http.get('/team/teamMemberList.do', {
      teamId: this.teamid
    }).then(data => {
      data.memberList = data.memberList || []

      data.memberList.sort(function(item1, item2) {
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
      data.memberList.forEach(mem => {
        const indexKey = mem.namePinyin.substr(0, 1)
        let list = map[indexKey]
        if (list == null) {
          list = []
          map[indexKey] = list
        }
        list.push(mem)
      })

      _.assign(this.serverData, {
        teamInfo: data.teamInfo || {},
        count: data.memberList.length,
        indexMap: map
      })
    })
  },
  data() {
    return {
      serverData: {
        teamInfo: {},
        count: 0
      },
      teamid: this.$route.query['teamid'],
      defaultTeamImg: utils.DEFAULT_TEAM_AVATAR_PIC_FULLPATH
    }
  }
}
</script>

<style lang="scss" scoped>
.team-flag {
  width: 12px;
  height: 12px;
}

.index-list-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
</style>
