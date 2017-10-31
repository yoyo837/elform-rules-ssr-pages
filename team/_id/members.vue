<template>
  <section class="container container-pd">
    <IndexList :data-list="serverData.list" @onSelect="onSelect"></IndexList>
  </section>
</template>

<script>
import _ from 'lodash'
import bdStyleMixin from '../../vue-features/mixins/body-style'
import IndexList from '../../vue-features/components/IndexList'

export default {
  head() {
    return {
      title: '团队成员'
    }
  },
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  mixins: [bdStyleMixin],
  components: {
    IndexList
  },
  mounted() {
    this.$http
      .get('/team/teamMemberList.do', {
        teamId: this.teamid
      })
      .then(data => {
        data = data || {}
        _.assign(this.serverData, {
          list: data.memberList
        })
      })
  },
  methods: {
    onSelect(member) {
      this.$router.push(`/user/profile?accountid=${member.pubAccountId}&teamid=${this.teamid}`)
    }
  },
  data() {
    return {
      serverData: {
        list: []
      },
      teamid: this.$route.params['id']
    }
  }
}
</script>

