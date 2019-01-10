<template>
  <div class="amap">
    <div id="amap-main">

    </div>
    <cruise></cruise>
    <clean></clean>
    <detect></detect>
  </div>
</template>

<script>
  import { lazyAMapApiLoaderInstance } from 'vue-amap';
  import Cruise from "../common/cruise";
  import Clean from '../common/clean';
  import Detect from '../common/detect';
  import { selectBound } from "../api/api";
  import { getCookie } from "../utils/cookie";
  import { rayCasting, rayBarrier } from "../utils/route/routeMapLoading";
//fzp123  123456
  let map;
  let marker;
  let amap;
  export default {
    name: "home",
    data () {
      return {
        id: -1,
      }
    },
    methods: {
      fetchBound (shipId) {
        selectBound({shipId: shipId}).then(res => {
          let lat;
          let lng;
          let next;
          const data = res.data.data;
          for (const i in data) {
            const border = [];
            if (!data[i].flag) {
              let latLng = data[i].latlng;
              latLng = latLng.slice(0, latLng.length - 1);
              latLng = latLng.split(";");
              for (next in latLng) {
                lng = latLng[next].split(",")[1];
                lat = latLng[next].split(",")[0];
                border.push([lng, lat])
              }
              border.push(border[0]);
              this.$variable.setAllBorder(border);
              let routeBorder = new AMap.Polyline({
                strokeColor: "#000",
                strokeOpacity: 0.4,
                strokeWeight: 3,
                strokeStyle: "solid",
                strokeDasharray: [10, 5]
              });
              let polygon = new AMap.Polygon({
                zIndex: -50,
                strokeColor: '#97EC71',
                strokeWeight: 2,
                fillColor: '#D1B90',
                fillOpacity: 0,
                cursor: "pointer"
              });
              polygon.on("click", this.getLngLat());
              polygon.setPath(border);
              polygon.setMap(map);
              routeBorder.setPath(border);
              routeBorder.setMap(map);
              this.$variable.setAllBorderList(routeBorder);

            } else if (data[i].flag) {
              let latLng = data[i].latlng;
              latLng = latLng.slice(0, latLng.length - 1);
              latLng = latLng.split(";");
              for (next in latLng) {
                lng = latLng[next].split(",")[1];
                lat = latLng[next].split(",")[0];
                border.push([lng, lat])
              }
              this.$variable.setAllBarrier(border);
              let polygon = new AMap.Polygon({
                zIndex: -50,
                strokeColor: '#97EC71',
                strokeWeight: 2,
                fillColor: '#D1B3E',
                fillOpacity: 0.7
              });
              polygon.setPath(border);
              polygon.setMap(map);
              this.$variable.setAllBarrierList(polygon);
            }
          }
        });
      },
      // 地图点击标点
      getLngLat (e) {
        let num = this.$variable.allRouteMarker[this.id].length;
        let flag = "";
        let flagBarrier = false;
        for (let i in this.$variable.allBorder) {
          flag = rayCasting(e.lnglat, this.$variable.allBorder[i]);
          if (flag) {
            break;
          }
        }
        for (let i in this.$variable.allBarrier) {
          flagBarrier = rayBarrier(e.lnglat, this.$variable.allBarrier[i],num);
          if (flagBarrier) {
            break;
          }
        }
        if (!flag) {
          alert("请在边界内部标点");
        }
        if (flag && !flagBarrier) {
          let icon = "";
          let marker;
          if (pointType === 0) {
            icon = "../../image/image2/导航点.png";
            marker = new AMap.Marker({
              icon: icon,
              map: map,
              position: e.lnglat,
              draggable: true,
              bubble: true,
              extData: pointType,
              title: "第" + (this.$variable.allRouteMarker[this.id].length - this.$variable.allWaterMarker[this.id].length + 1).toString() + "个导航点",
            });
          } else if (pointType === 1) {
            icon = "../../image/image2/水质点.png";
            marker = new AMap.Marker({
              icon: icon,
              map: map,
              position: e.lnglat,
              draggable: true,
              bubble: true,
              extData: pointType,
              title: "第" + (this.$variable.allWaterMarker[this.id].length + 1).toString() + "个水质点",
            });
          }
          if (pointType === 0) {
            this.$variable.setPointLabelType('0');
          } else if (pointType === 1) {
            this.$variable.setAllWaterMarker(this.id, marker);
            this.$variable.setPointLabelType('1');
            this.$variable.setWqNumber();
          }
          num++;
          this.$variable.setAllRouteMarker(this.id, marker);
          this.$variable.setAllRouteMarkerPosition(this.id, e.lnglat);
          marker.on('click', joinFirst);
          marker.on('dragging', routeEdit);
          routeLine.setPath(this.$variable.allRouteMarkerPosition[this.id]);
          routeLine.setMap(map);
        }
      },
    },
    mounted() {
      lazyAMapApiLoaderInstance.load().then(() => {
        map = new AMap.Map('amap-main', {
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

        const routeLine = new AMap.Polyline({
          strokeColor: '#F00', // 线颜色
          strokeOpacity: 0.4, //
          strokeWeight: 3, // 线宽
          strokeStyle: 'solid', // 线样式
          strokeDasharray: [10, 5],
        });
        const routeTrack = new AMap.Polyline({
          strokeColor: '#008000',
          strokeOpacity: 0.4,
          strokeWeight: 3,
          strokeStyle: 'solid',
          strokeDasharray: [10, 5],
        });

        // map.on('mousemove', setMap);
        // function setMap() {
        map.on('click', this.getLngLat);
        // }

        // 删除点
        function joinFirst(e){
          // this.setMap(null);
          map.off('click', getLnglat);
          this.$variable.setAllRouteMarkerPosition(this.id, this.$variable.allRouteMarker[this.id][0].getPosition());
          routeLine.setPath(this.$variable.allRouteMarkerPosition[this.id]);
          routeLine.setMap(map);
        }
        // 点在拖动过程中即时更改路径
        function routeEdit(){
          for(const i in this.$variable.allRouteMarker[this.id]){
            this.$variable.allRouteMarkerPosition[this.id][i] = this.$variable.allRouteMarker[this.id][i].getPosition();
          }
          routeLine.setPath(this.$variable.allRouteMarkerPosition[this.id]);
          routeLine.setMap(map);
        }
      });
      this.fetchBound(5);
      // this.fetchBound(getCookie('shipId'));
      // this.$socketApi.sendSocket();
    },
    components: {
      Cruise,
      Clean,
      Detect,
    },
  }
</script>

<style>
  #amap-main {
    height: 5.4rem;
  }
  /* 覆盖高德logo样式 */
  .amap .amap-logo {
    right: -10000px !important;
    left: auto !important;
    display: none;
  }
  .amap .amap-copyright {
    bottom: -10000px;
    display: none;
  }
</style>
