<template>
  <div class="amap">
    <div id="amap-main"></div>
    <!--<cruise v-if="true"></cruise>-->
  </div>
</template>

<script>
  import { lazyAMapApiLoaderInstance } from 'vue-amap';
  import Cruise from "../common/cruise";
  export default {
    name: "home",
    components: {
      Cruise,
    },
    mounted() {
      lazyAMapApiLoaderInstance.load().then(() => {
        this.map = new AMap.Map('amap-main', {
          resizeEnable: true, // 是否监控地图容器尺寸变化
          center: [108.898352, 34.24743], // 中心点坐标
          expandZoomRange: true, // 设置可扩展最大缩放级别
          zooms: [4, 20], // 设置地图级别范围
          zoom: 18, // 级别
          layers: [ // 使用多个图层
            new AMap.TileLayer.Satellite(),
            new AMap.TileLayer.RoadNet()
          ],
        });
        // this.map.plugin();
      });
    }
  }
</script>

<style scoped>
  #amap-main {
    height: 5.4rem;
  }
</style>
