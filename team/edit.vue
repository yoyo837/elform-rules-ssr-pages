<template>
  <section class="container">
    <ProfilePanel :pic-path="serverData.picPath" size="small" type="team">
      {{serverData.realName}}/{{serverData.mobile}}
    </ProfilePanel>
  </section>
</template>

<script>
import ProfilePanel from '../vue-features/components/ProfilePanel'
export default {
  name: 'team-edit',
  components: {
    ProfilePanel
  },
  data() {
    return {
      serverData: {}
    }
  }
}
</script>

<style>

</style>
