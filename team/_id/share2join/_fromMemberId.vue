<template>
  <section class="container container-pd">
    <Card>
      <ProfilePanel :pic-path="teamid" type="team">
      </ProfilePanel>
    </Card>
  </section>
</template>

<script>
import Card from '../../../vue-features/components/Card'
import ProfilePanel from '../../../vue-features/components/ProfilePanel'
import bdStyleMixin from '../../../vue-features/mixins/body-style'

export default {
  validate({ params, query }) {
    return /^\d+$/.test(params.id) && /^\d+$/.test(params.fromMemberId)
  },
  head() {
    return {
      title: '邀请加入'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    Card,
    ProfilePanel
  },
  mounted() {
    this.$http.get('/team/teamSimpleInfo.do', {
      teamId: this.teamid,
      invitePubAccountId: this.fromMemberId
    }).then(data => {

    })
  },
  data() {
    return {
      teamid: this.$route.params['id'],
      fromMemberId: this.$route.params['fromMemberId']
    }
  }
}
</script>

