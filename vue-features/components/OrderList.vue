<template>
  <div class="order-content" :class="`order-content__${size}`">
    <!-- 场地 -->
    <div class="order-content-item" v-for="dealPlatform in dataObj.dealPlatformList" :key="dealPlatform.dealPlatformId">
      <img class="item-img" :src="`${(dataObj.commonSales.picUrl || [])[1] || `${CDN_IMG_HOST}/commonsales/0/`}58X58.gif`">
      <div class="item-ctt">
        <div class="item-ctt-title text-overflow">
          {{dealPlatform.salesName}}
        </div>
        <div class="item-ctt-desc">
          <el-row>
            <el-col :span="size == null ? 14 : 24" class="text-overflow">
              {{dealPlatform.platformName}} {{dealPlatform.startTime}}-{{dealPlatform.endTime}}
            </el-col>
            <el-col :span="10" v-if="size == null" class="text-right">
              <template v-if="getNewPriceText(dealPlatform.dealPlatformId, 49)">
                <del>
                  ￥{{formatMoney(dealPlatform.transactionPrice || dealPlatform.platformPrice || 0)}}
                </del>
                <span>￥{{getNewPriceText(dealPlatform.dealPlatformId, 49)}}</span>
              </template>
              <template v-else>
                ￥{{formatMoney(dealPlatform.transactionPrice || dealPlatform.platformPrice || 0)}}
              </template>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 服务人员 -->
    <div class="order-content-item" v-for="serviceUser in dataObj.dealServiceUserList" :key="serviceUser.sysUserId">
      <img class="item-img" :src="`${(serviceUser.picUrl || [])[1] || `${CDN_IMG_HOST}/user/0/`}60X60.jpg`">
      <div class="item-ctt">
        <div class="item-ctt-title text-overflow">
          {{serviceUser.career}}
        </div>
        <div class="item-ctt-desc">
          <el-row>
            <el-col :span="size == null ? 14 : 24" class="text-overflow">
              {{serviceUser.professional}}-{{serviceUser.realName}}
            </el-col>
            <el-col :span="10" v-if="size == null" class="text-right">
              <template v-if="getNewPriceText(serviceUser.dealServicePubId, 50)">
                <del>
                  ￥{{formatMoney(serviceUser.transactionPrice || serviceUser.servicePrice || 0)}}
                </del>
                <span>￥{{getNewPriceText(dealPlatform.dealServicePubId, 50)}}</span>
              </template>
              <template v-else>
                ￥{{formatMoney(serviceUser.transactionPrice || serviceUser.servicePrice || 0)}}
              </template>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 商品 -->
    <template v-for="dealItem in dataObj.dealItemList">
      <div class="order-content-item" v-for="dealItemSnap in dealItem.dealItemSnapList" :key="dealItemSnap.itemId">
        <img class="item-img" :src="`${(dealItemSnap.picUrl || [])[1] || `${CDN_IMG_HOST}/gift/0/`}60X60.jpg`">
        <div class="item-ctt">
          <div class="item-ctt-title text-overflow">
            {{dealItemSnap.itemName}}
          </div>
          <div class="item-ctt-desc">
            <el-row>
              <el-col :span="size == null ? 14 : 24" class="text-overflow">
                {{dealItemSnap.itemNum}}{{dealItemSnap.itemUnit}}
              </el-col>
              <el-col :span="10" v-if="size == null" class="text-right">
                <template v-if="getNewPriceText(dealItemSnap.dealItemSnapId, 55)">
                  <del>
                    ￥{{formatMoney(dealItemSnap.transactionTotalPrice || dealItemSnap.itemTotalPrice || 0)}}
                  </del>
                  <span>￥{{getNewPriceText(dealItemSnap.dealItemSnapId, 55)}}</span>
                </template>
                <template v-else>
                  ￥{{formatMoney(dealItemSnap.transactionTotalPrice || dealItemSnap.itemTotalPrice || 0)}}
                </template>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </template>
    <!-- 票务 -->
    <div class="order-content-item" v-for="dealTicket in dataObj.dealTicketList" :key="dealTicket.dealTicketId">
      <img class="item-img" :src="`${(dealTicket.picUrl || [])[1] || `${CDN_IMG_HOST}/exerciselist/0/`}125X80.jpg`">
      <div class="item-ctt">
        <div class="item-ctt-title text-overflow">
          {{dealTicket.ticketName}}
        </div>
        <div class="item-ctt-desc">
          <el-row>
            <el-col :span="size == null ? 14 : 24" class="text-overflow">
              {{dealTicket.orderDate}} {{dealTicket.startTime}} {{dealTicket.salesNum}}张
            </el-col>
            <el-col :span="10" v-if="size == null" class="text-right">
              <template v-if="getNewPriceText(dealTicket.dealTicketId, 99)">
                <del>
                  ￥{{formatMoney(dealTicket.transactionTotalPrice || dealTicket.ticketTotalPrice || 0)}}
                </del>
                <span>￥{{getNewPriceText(dealTicket.dealTicketId, 99)}}</span>
              </template>
              <template v-else>
                ￥{{formatMoney(dealTicket.transactionTotalPrice || dealTicket.ticketTotalPrice || 0)}}
              </template>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 报名 -->
    <div class="order-content-item" v-for="dealSignup in dataObj.dealSignupList" :key="dealSignup.dealSignupId">
      <img class="item-img" :src="`${(dealSignup.picUrl || [])[1] || `${CDN_IMG_HOST}/exerciselist/0/`}125X80.jpg`">
      <div class="item-ctt">
        <div class="item-ctt-title text-overflow">
          {{dealSignup.objectName}}
        </div>
        <div class="item-ctt-desc">
          <el-row>
            <el-col :span="size == null ? 14 : 24" class="text-overflow">
              {{dealSignup.objectStartDate}}至{{dealSignup.objectEndDate}}
            </el-col>
            <el-col :span="10" v-if="size == null" class="text-right">
              <template v-if="getNewPriceText(dealSignup.dealSignupId, 100)">
                <del>
                  ￥{{formatMoney(dealSignup.transactionPrice || dealSignup.signupPrice || 0)}}
                </del>
                <span>￥{{getNewPriceText(dealSignup.dealSignupId, 100)}}</span>
              </template>
              <template v-else>
                ￥{{formatMoney(dealSignup.transactionPrice || dealSignup.signupPrice || 0)}}
              </template>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 会员服务 -->
    <div class="order-content-item" v-for="servicePub in dataObj.dealServicePubList" :key="servicePub.serviceId">
      <img class="item-img" :src="`${(servicePub.picUrl || [])[1] || `${CDN_IMG_HOST}/pubservice/0/`}140X90.jpg`">
      <div class="item-ctt">
        <div class="item-ctt-title text-overflow">
          {{servicePub.serviceName}}
        </div>
        <div class="item-ctt-desc">
          <el-row>
            <el-col :span="size == null ? 14 : 24" class="text-overflow">
              {{servicePub.salesName}}
            </el-col>
            <el-col :span="10" v-if="size == null" class="text-right">
              <template v-if="getNewPriceText(servicePub.dealServicePubId, 57)">
                <del>
                  ￥{{formatMoney(servicePub.transactionTotalPrice || servicePub.servicePrice || 0)}}
                </del>
                <span>￥{{getNewPriceText(servicePub.dealServicePubId, 57)}}</span>
              </template>
              <template v-else>
                ￥{{formatMoney(servicePub.transactionTotalPrice || servicePub.servicePrice || 0)}}
              </template>
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
    size: String,
    couponInfo: Object
  },
  methods: {
    getNewPriceText(innerItemDealId, relType) {
      if (this.couponInfo == null || innerItemDealId == null || relType == null) {
        return null
      }
      const targetItem = (this.couponInfo.dealServicePrice || []).find(item => {
        return item.relType === relType && innerItemDealId === item.dataId
      })
      if (targetItem == null) {
        return null
      }
      return targetItem.newPriceValue
    }
  },
  computed: {
    dataObj() {
      if (this.dealInfo == null) {
        return { commonSales: {} }
      }
      // https://github.com/nuxt/nuxt.js/issues/1975
      this.dealInfo.commonSales = this.dealInfo.commonSales || {}
      return this.dealInfo
    }
  }
}
</script>

<style lang="scss" scoped>
del + span {
  color: #f26a3e;
}
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

