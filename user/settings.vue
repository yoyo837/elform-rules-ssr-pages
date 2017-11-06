<template>
  <section class="container container-pd">
    <Card :mini="true">
      <ProfileField to="/user/changepwd" :for-nav="true">
        <i class="icon-pt-cpwd"></i>
        <span>修改密码</span>
      </ProfileField>
      <ProfileField to="/user/0" :for-nav="true">
        <i class="icon-pt-profile"></i>
        <span>个人资料</span>
      </ProfileField>

    </Card>

    <Card :mini="true">
      <ProfileField to="/about" :for-nav="true">
        <i class="icon-pt-about"></i>
        <span>关于我们</span>
      </ProfileField>
      <ProfileField to="/support" :for-nav="true">
        <i class="icon-pt-about"></i>
        <span>技术支持</span>
      </ProfileField>
    </Card>
  </section>
</template>

<script>
import bdStyleMixin from '../vue-features/mixins/body-style'
import ProfileField from '../vue-features/components/ProfileField'
import Card from '../vue-features/components/Card'

export default {
  head() {
    return {
      title: '设置'
    }
  },
  mixins: [bdStyleMixin],
  components: {
    Card,
    ProfileField
  }
}
</script>
