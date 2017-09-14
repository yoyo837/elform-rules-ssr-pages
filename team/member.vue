<template>
  <ProfilePanel :pic-path="serverData.loginAccountVo.picPath">
    {{serverData.loginAccountVo.realName}}/{{serverData.loginAccountVo.mobile}}
  </ProfilePanel>
</template>

<script>
export default {
  name: 'team-member',
  head() {
    return {
      title: '编辑我的团队信息'
    }
  },
  mounted() {
    this.$http.get('/team/teamMemberInfo.do', {
      teamId: this.teamid,
      professionalId: this.key
    }).then(data => {

    }).catch(() => { })
  },
  data() {
    return {
      teamid: this.$route.query['teamid'],
      key: this.$route.query['key']
    }
  }
}
</script>

<style>

</style>
