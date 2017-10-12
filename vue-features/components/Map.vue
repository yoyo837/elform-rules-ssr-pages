<template>
  <section id="cust-map" class="cust-map">
    <button class="cust-btn btn-driving" v-show="mapReady && showDrivingBtn">
      <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/dh-1.png`">
    </button>
    <button class="cust-btn btn-positioning" v-show="mapReady">
      <img :src="`${CDN_STATIC_HOST}/themes/mobile/common/images/dw-1.png`">
    </button>
    <el-button type="primary" size="mini" class="call-app" v-show="mapReady && showCallAppBtn">打开高德地图</el-button>
  </section>
</template>

<script>
import Vue from 'vue'
import utils from '../../../components/utils'
import popup from '../../../components/popup'
import { Button } from 'element-ui'
// nuxt.config.js的externals配置似乎不可用
// import wx from 'jweixin'
const wx = process.browser ? window.wx || {} : {}

Vue.component(Button.name, Button)

export default {
  props: {
    name: { // 地点名称
      type: String,
      default: '地点'
    },
    address: String, // 地址
    lng: { // 经度
      type: Number,
      required: true
    },
    lat: { // 纬度
      type: Number,
      required: true
    }
  },
  mounted() {
    if (process.browser) {
      if (window.AMap == null) {
        window.AMap = {} // 占坑
        this.$nextTick().then(() => {
          window.CustAmapInitCallback = this.custAmapInitCallback

          const script = document.createElement('script')
          script.setAttribute('src', '//webapi.amap.com/maps?v=1.4.0&key=2975e8ce0b001e147ed9cfd5174cbec5&plugin=AMap.ToolBar,AMap.Driving&callback=CustAmapInitCallback')
          script.setAttribute('charset', 'utf-8')
          const head = document.getElementsByTagName('head')[0]
          head.appendChild(script)
        })
      }
    }
  },
  methods: {
    getDom(className) {
      if (className == null) {
        return null
      }
      className = className.trim()
      if (className.length === 0) {
        return null
      }
      const dom = this.mapInstance.getContainer()
      return [...dom.children].find(child => { // 第一个匹配的单个结果
        return child.className.split(' ').includes(className)
      })
    },
    custAmapInitCallback() {
      if (this.mapInstance) {
        return
      }
      const AMap = window.AMap
      const zoom = 11
      let locationInfo = null // 当前定位信息

      const target = new AMap.LngLat(this.lng, this.lat) // 目标地

      this.mapInstance = new AMap.Map('cust-map', {
        resizeEnable: true,
        zoom,
        center: [target.getLng(), target.getLat()]
      })

      this.mapInstance.on('complete', e => {
        this.mapReady = true
      })

      // 定位
      AMap.event.addDomListener(this.getDom(this.positioningCls), 'click', e => {
        this.mapInstance.setFitView()
        this.mapInstance.setZoom(zoom)
      })

      const driving = new AMap.Driving({
        map: this.mapInstance
      })

      // 规划导航
      AMap.event.addDomListener(this.getDom(this.drivingCls), 'click', e => {
        if (locationInfo == null) {
          popup.alert('定位失败，无法规划线路')
          return
        }
        if (utils.isWeiXin()) { // 微信地图
          this.$wxConfig(true).then(jsConfig => {
            jsConfig = jsConfig || {}
            wx.config({
              debug: false,
              appId: jsConfig.appId,
              timestamp: jsConfig.timestamp,
              nonceStr: jsConfig.nonStr,
              signature: jsConfig.signature,
              jsApiList: ['openLocation']
            })

            wx.error(res => {
              popup.alert(res.errMsg)
            })

            wx.ready(() => {
              wx.openLocation({
                latitude: this.lat, // 纬度，浮点数，范围为90 ~ -90
                longitude: this.lng, // 经度，浮点数，范围为180 ~ -180。
                name: this.name, // 位置名
                address: this.address, // 地址详情说明
                scale: 10, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: null // 在查看位置界面底部显示的超链接,可点击跳转
              })
            })
          })
        } else {
          driving.search(new AMap.LngLat(locationInfo.lng, locationInfo.lat), target, {}, (status, result) => {
            this.showCallAppBtn = true
          })
        }
      })

      // 调起高德app
      AMap.event.addDomListener(this.getDom(this.callAppCls), 'click', e => {
        driving.searchOnAMAP({
          origin: new AMap.LngLat(locationInfo.lng, locationInfo.lat),
          originName: '我的位置',
          destination: target,
          destinationName: this.address || this.name
        })
      })

      const toolBar = new AMap.ToolBar()
      this.mapInstance.addControl(toolBar)
      AMap.event.addListener(toolBar, 'location', e => {
        this.showDrivingBtn = true

        locationInfo = e.lnglat
      })
      toolBar.doLocation()

      const marker = new AMap.Marker({
        // map: this.mapInstance,
        icon: `${utils.CDN_STATIC_HOST}/themes/mobile/common/images/mark_bs-h.gif`,
        position: target,
        cursor: 'pointer' // 鼠标悬停点标记时的鼠标样式
      })

      marker.setMap(this.mapInstance)
    }
  },
  data() {
    return {
      drivingCls: 'btn-driving',
      positioningCls: 'btn-positioning',
      callAppCls: 'call-app',
      mapReady: false,
      showDrivingBtn: false,
      showCallAppBtn: false,
      mapInstance: null
    }
  }
}
</script>

<style lang="scss">
.cust-map {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;

  .amap-marker {
    .amap-icon {
      img {
        height: 34px;
        width: auto;
      }
    }
  }

  .cust-btn {
    position: absolute;
    left: 10px;
    width: 34px;
    height: 34px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 3px;
    transition-duration: .2s;
    outline: none;
    z-index: 1;
    img {
      width: 100%;
      height: auto;
    }
    &.btn-positioning {
      bottom: 20px;
    }
    &.btn-driving {
      bottom: 60px;
    }
    &:active {
      background-color: #929292;
      color: white;
    }
  }

  .call-app {
    z-index: 1;
    position: absolute;
    bottom: 3px;
    right: 50px;
  }
}
</style>

