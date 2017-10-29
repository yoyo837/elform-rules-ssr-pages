<template>
  <div class="order-content" :class="`order-content__${size}`">
    <!-- 场地 -->
    <div class="order-content-item" v-for="dealPlatform in dealInfo.dealPlatformList" :key="dealPlatform.dealPlatformId">
      <img class="item-img" :src="`${((dealInfo.commonSales || {}).picUrl || [])[1] || `${CDN_IMG_HOST}/commonsales/0/`}58X58.gif`">
      <div class="item-ctt">
        <div class="item-ctt-title text-overflow">
          {{dealPlatform.salesName}}
        </div>
        <div class="item-ctt-desc">
          <el-row>
            <el-col :span="size == null ? 20 : 24" class="text-overflow">
              {{dealPlatform.platformName}} {{dealPlatform.startTime}}-{{dealPlatform.endTime}}
            </el-col>
            <el-col :span="4" v-if="size == null" class="text-center">
              ￥{{dealPlatform.transactionPrice || dealPlatform.platformPrice}}
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 服务人员 -->
    <div class="order-content-item" v-for="serviceUser in dealInfo.dealServiceUserList" :key="serviceUser.sysUserId">
      <img class="item-img" :src="`${(serviceUser.picUrl || [])[1] || `${CDN_IMG_HOST}/user/0/`}60X60.jpg`">
      <div class="item-ctt">
        <div class="item-ctt-title text-overflow">
          {{serviceUser.career}}
        </div>
        <div class="item-ctt-desc">
          <el-row>
            <el-col :span="size == null ? 20 : 24" class="text-overflow">
              {{serviceUser.professional}}-{{serviceUser.realName}}
            </el-col>
            <el-col :span="4" v-if="size == null" class="text-center">
              ￥{{serviceUser.transactionPrice || serviceUser.servicePrice}}
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 商品 -->
    <template v-for="dealItem in dealInfo.dealItemList">
      <div class="order-content-item" v-for="dealItemSnap in dealItem.dealItemSnapList" :key="dealItemSnap.itemId">
        <img class="item-img" :src="`${(dealItemSnap.picUrl || [])[1] || `${CDN_IMG_HOST}/gift/0/`}60X60.jpg`">
        <div class="item-ctt">
          <div class="item-ctt-title text-overflow">
            {{dealItemSnap.itemName}}
          </div>
          <div class="item-ctt-desc">
            <el-row>
              <el-col :span="size == null ? 20 : 24" class="text-overflow">
                {{dealItemSnap.itemNum}}{{dealItemSnap.itemUnit}}
              </el-col>
              <el-col :span="4" v-if="size == null" class="text-center">
                ￥{{dealItemSnap.transactionTotalPrice || dealItemSnap.itemTotalPrice}}
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </template>
    <!-- 票务 -->
    <div class="order-content-item" v-for="dealTicket in dealInfo.dealTicketList" :key="dealTicket.dealTicketId">
      <img class="item-img" :src="`${(dealTicket.picUrl || [])[1] || `${CDN_IMG_HOST}/exerciselist/0/`}125X80.jpg`">
      <div class="item-ctt">
        <div class="item-ctt-title text-overflow">
          {{dealTicket.ticketName}}
        </div>
        <div class="item-ctt-desc">
          <el-row>
            <el-col :span="size == null ? 20 : 24" class="text-overflow">
              {{dealTicket.orderDate}} {{dealTicket.startTime}} {{dealTicket.salesNum}}张
            </el-col>
            <el-col :span="4" v-if="size == null" class="text-center">
              ￥{{dealTicket.transactionTotalPrice || dealTicket.ticketPrice}}
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 报名 -->
    <div class="order-content-item" v-for="dealSignup in dealInfo.dealSignupList" :key="dealSignup.dealSignupId">
      <img class="item-img" :src="`${(dealSignup.picUrl || [])[1] || `${CDN_IMG_HOST}/exerciselist/0/`}125X80.jpg`">
      <div class="item-ctt">
        <div class="item-ctt-title text-overflow">
          {{dealSignup.objectName}}
        </div>
        <div class="item-ctt-desc">
          <el-row>
            <el-col :span="size == null ? 20 : 24" class="text-overflow">
              {{dealSignup.objectStartDate}}至{{dealSignup.objectEndDate}}
            </el-col>
            <el-col :span="4" v-if="size == null" class="text-center">
              ￥{{dealSignup.transactionPrice || dealSignup.signupPrice}}
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 会员服务 -->
    <div class="order-content-item" v-for="servicePub in dealInfo.dealServicePubList" :key="servicePub.serviceId">
      <img class="item-img" :src="`${(servicePub.picUrl || [])[1] || `${CDN_IMG_HOST}/pubservice/0/`}140X90.jpg`">
      <div class="item-ctt">
        <div class="item-ctt-title text-overflow">
          {{servicePub.serviceName}}
        </div>
        <div class="item-ctt-desc">
          <el-row>
            <el-col :span="size == null ? 20 : 24" class="text-overflow">
              {{servicePub.salesName}}
            </el-col>
            <el-col :span="4" v-if="size == null" class="text-center">
              ￥{{servicePub.transactionTotalPrice || servicePub.servicePrice}}
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Row, Col } from 'element-ui'

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)

export default {
  props: {
    dealInfo: {
      type: Object,
      required: true
    },
    size: String
  }
}
</script>

<style lang="scss" scoped>
.order-content {
  .order-content-item {
    padding: 2px 0;
    .item-img {
      width: 40px;
      height: 40px;
      vertical-align: top;
    }
    .item-ctt {
      display: inline-block;
      width: calc(100% - 40px);
      height: 40px;
      padding-left: 8px;
      .item-ctt-title {
        color: #222;
        line-height: 25px;
      }
      .item-ctt-desc {
        font-size: 12px;
        color: #999;
        line-height: 15px;
      }
    }
  }
}
.order-content__large {
  .order-content-item {
    .item-img {
      width: 50px;
      height: 50px;
    }
    .item-ctt {
      width: calc(100% - 50px);
      height: 50px;
      .item-ctt-title {
        font-size: 18px;
        font-weight: bolder;
        line-height: 30px;
      }
      .item-ctt-desc {
        line-height: 20px;
      }
    }
  }
}
</style>

