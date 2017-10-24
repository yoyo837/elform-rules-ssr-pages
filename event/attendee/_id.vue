<template>
  <section class="container container-pd">
    <Card>
      <div class="attendee-title">
        灯火晚会 名单
      </div>
      <div class="attendee-desc">
        5人
      </div>
    </Card>
    <div class="index-item">
      <div class="index-key">A</div>
      <Card>
        <div class="attende-menber">
          <img :src="`${defUserAvatar}60X60.jpg`" class="attende-avatar">
          <div class="attende-name">阿明</div>
          <div class="attende-gender">
            <i class="fa fa-id-card" aria-hidden="true"></i>
          </div>
        </div>
        <div class="attende-menber">
          <img :src="`${defUserAvatar}60X60.jpg`" class="attende-avatar">
          <div class="attende-name">阿明</div>
          <div class="attende-gender">
            <i class="fa fa-id-card" aria-hidden="true"></i>
          </div>
        </div>
        <div class="attende-menber">
          <img :src="`${defUserAvatar}60X60.jpg`" class="attende-avatar">
          <div class="attende-name">阿明</div>
          <div class="attende-gender">
            <i class="fa fa-id-card" aria-hidden="true"></i>
          </div>
        </div>
      </Card>
    </div>
    <div class="index-item">
      <div class="index-key">B</div>
      <Card>
        <div class="attende-menber">
          <img :src="`${defUserAvatar}60X60.jpg`" class="attende-avatar">
          <div class="attende-name">阿明</div>
          <div class="attende-gender">
            <i class="fa fa-id-card" aria-hidden="true"></i>
          </div>
        </div>
        <div class="attende-menber">
          <img :src="`${defUserAvatar}60X60.jpg`" class="attende-avatar">
          <div class="attende-name">阿明</div>
          <div class="attende-gender">
            <i class="fa fa-id-card" aria-hidden="true"></i>
          </div>
        </div>
        <div class="attende-menber">
          <img :src="`${defUserAvatar}60X60.jpg`" class="attende-avatar">
          <div class="attende-name">阿明</div>
          <div class="attende-gender">
            <i class="fa fa-id-card" aria-hidden="true"></i>
          </div>
        </div>
      </Card>
    </div>
  </section>
</template>

<script>
import utils from '../../../components/utils'
import bdStyleMixin from '../../vue-features/mixins/body-style'
import Card from '../../vue-features/components/Card'

export default {
  head() {
    return {
      title: '我的活动'
    }
  },
  validate({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  mixins: [bdStyleMixin],
  components: {
    Card
  },
  data() {
    return {
      defUserAvatar: utils.DEFAULT_USER_AVATAR_PIC_PATH
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .attendee-title,
  .attendee-desc {
    padding: 4px 0;
  }
  .attendee-title {
    color: #222;
    font-size: 18px;
    font-weight: bolder;
  }

  .index-item {
    margin-top: 8px;
    font-size: 14px;
    .index-key {
      color: #999;
    }
    .attende-menber {
      height: 70px;
      line-height: 70px;
      .attende-avatar {
        border-radius: 50%;
        vertical-align: middle;
        height: 80%;
        width: auto;
      }
      .attende-name,
      .attende-gender {
        display: inline-block;
        padding-left: 8px;
      }
      .attende-name {
        color: #222;
      }
    }
    .attende-menber + .attende-menber {
      border-top: 1px solid #f0f0f0;
    }
  }
}
</style>


