<template>
  <section id="cust-map" class="cust-map">
  </section>
</template>

<script>
import utils from '../../../components/utils'

const drivingCls = 'btn-driving'
let mapInstance

if (process.browser) {
  window.CustAmapInitCallback = function() {
    if (mapInstance) {
      return
    }
    const AMap = window.AMap
    mapInstance = new AMap.Map('cust-map', {
      resizeEnable: true,
      zoom: 11,
      center: [116.397428, 39.90923]
    })

    const target = new AMap.LngLat(116.397428, 39.90923)

    // console.log(AMap, mapInstance)
    const driving = new AMap.Driving({
      map: mapInstance
    })

    const toolBar = new AMap.ToolBar()
    mapInstance.addControl(toolBar)
    AMap.event.addListener(toolBar, 'location', function(e) {
      const locationInfo = e.lnglat

      const dom = mapInstance.getContainer()
      let btn = [...dom.children].find(child => {
        return child.className.split(' ').includes(drivingCls)
      })
      if (btn == null) {
        btn = document.createElement('button')
        btn.setAttribute('type', 'button')

        const img = document.createElement('img')
        img.setAttribute('src', `${utils.CDN_STATIC_HOST}/themes/mobile/common/images/dh-1.png`)
        btn.appendChild(img)

        btn.className = drivingCls
        dom.appendChild(btn)
      }
      btn.onclick = function() { // 每次重写
        // if (utils.isWeiXin()) { // 微信地图
        // }
        driving.search(new AMap.LngLat(locationInfo.lng, locationInfo.lat), target)
      }
    })
    toolBar.doLocation()

    const marker = new AMap.Marker({
      // map: mapInstance,
      icon: `${utils.CDN_STATIC_HOST}/themes/mobile/common/images/mark_bs-h.gif`,
      position: target,
      cursor: 'pointer' // 鼠标悬停点标记时的鼠标样式
    })

    marker.setMap(mapInstance)
  }
}
export default {
  mounted() {
    if (process.browser) {
      if (window.AMap == null) {
        window.AMap = {} // 占坑
        this.$nextTick().then(() => {
          const script = document.createElement('script')
          // script.setAttribute('src', '//webapi.amap.com/maps?v=1.4.0&key=2975e8ce0b001e147ed9cfd5174cbec5&plugin=AMap.Driving')
          script.setAttribute('src', '//webapi.amap.com/maps?v=1.4.0&key=2975e8ce0b001e147ed9cfd5174cbec5&plugin=AMap.ToolBar,AMap.Driving&callback=CustAmapInitCallback')
          script.setAttribute('charset', 'utf-8')
          const head = document.getElementsByTagName('head')[0]
          head.appendChild(script)
        })
      }
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

  .btn-driving {
    position: absolute;
    bottom: 20px;
    left: 10px;
    width: 34px;
    height: 34px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 3px;
    transition-duration: .2s;
    outline: none;
    img {
      width: 100%;
      height: auto;
    }
    &:active {
      background-color: #929292;
      color: white;
    }
  }
}
</style>

