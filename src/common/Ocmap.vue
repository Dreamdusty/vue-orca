<template>
  <div class="amap">
    <div id="amap-main" ></div>
  </div>
</template>
<style scoped >
  #amap-main {
    width: 94vw !important;
    margin-left: 3vw !important;
    -webkit-appearance: none !important;
    height: 90vh !important;
    transform: translate3d(0,0,0) !important;
    -moz-border-radius: 15px; /* Firefox */
    -webkit-border-radius: 15px; /* Safari 和 Chrome */
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

<script>
  import {lazyAMapApiLoaderInstance} from 'vue-amap';
  import roadIcon from '../../static/image/1.png';
  import waterIcon from '../../static/image/2.png';
  import shipIcon from '../../static/image/Ship.png';
  import shipIcon2 from '../../static/image/ship2.png'
  import areaIcon from '../../static/image/3.png';
  import areaRoadIcon from '../../static/image/4.png';
  import {insertShipRoute} from '../api/api';

  let map;//地图实例
  let polyline;//路径折线
  let path = [];//路径点
  let arealine;//区域未闭合前的直线
  let arealinePath = [];//区域未闭合时的点
  let cleanline;//清洁路线实例
  let cleanPath = [];//情节路线
  let polygon;//区域
  let areaPath = [];//区域点
  let boundary = []; //边界区域实例集合
  let obstacle = []; //障碍区域物实例集合
  let waterline = [];//水质线
  let waterPath = [];//水质点
  let routeLine;
  let routeLinePath = [];
  let copy = [];//临时保存数据的数组 要跨函数传参 所以定义全局
  let copy2 = [];//临时数组 因为copy 和copy2会同时用到所以定义俩个

  export default {

    data() {
      return {
        markers: [],//路径点maeker实例集合
        markersShip: [ ],//船标点实例
        markersWater: [],//水质点maeker实例集合
        markersArae: [],//区域点maeker实例集合
        markersAraeline: [],//未闭合区域点maeker实例集合
        markersClean: [],//清洁路线实例
        areaSign: 0,//区域是否闭合 0未闭合 1 闭合
        //isdel: 1,//是否允许删除 0 禁止 1 允许
        //pointType: ,//marker点的类型 0路径 1水质 2区域
        //shipChooseId: -1,//-1表示未选择，0表示选择0号船依此类推
        icon:null,
        activeTaskList: [],
      }
    },
    mounted() {
      lazyAMapApiLoaderInstance.load().then(() => {
        //初始化地图
        this.initMap();
        //初始化路径，清洁，区域等相关折线
        this.initPolyline();
        //初始化边界
        this.initBoundaryAndObstacles();
        //初始化船图标
        this.initShip();
      });
    },
    methods: {
      //初始化地图
      initMap(){
        map = new AMap.Map('amap-main', {
          resizeEnable: true, // 是否监控地图容器尺寸变化
          center: [108.898352, 34.24743], // 中心点坐标
          expandZoomRange: true, // 设置可扩展最大缩放级别
          zooms: [15, 20], // 设置地图级别范围
          zoom: 18, // 级别
          layers: [ // 使用多个图层
            new AMap.TileLayer.Satellite(),
            new AMap.TileLayer.RoadNet()
          ],
        });
        map.on('click', this.addMarker);
      },
      //获取船坐标
      getShipLngLat(){
        let ships = [];
        for (let i=0;i<this.$store.getters.curr_lng.length;i++) {
          ships[i] = new Array();
          ships[i][0] = this.$store.getters.curr_lng[i];
          ships[i][1] = this.$store.getters.curr_lat[i];
        }
        console.log('船位置');
        console.log(ships);
        console.log('=======================================')
        return ships;
      },
      //初始化船
      initShip() {
        let lnglat;
        if (this.markersShip.length !== 0){
          map.remove(this.markersShip);
        }
        let Icon = new AMap.Icon({
          image: shipIcon,
          imageSize: new AMap.Size(25, 25),
        });
        let Icon2 = new AMap.Icon({
          image: shipIcon2,
          imageSize: new AMap.Size(25, 25),
        });
        for(let i = 0;i<this.ship.length;i++) {
            lnglat = new AMap.LngLat(this.ship[i][0],this.ship[i][1]);
            if (this.shipChooseId === i) {
              this.markersShip[i] = new AMap.Marker({
                icon: Icon2,
                map: map,
                angle: this.shipAngle[i],
                offset:new AMap.Pixel(-12, -10),
                position: lnglat,
                extData: i,
              });
            }else {
              this.markersShip[i] = new AMap.Marker({
                icon: Icon,
                map: map,
                angle: this.shipAngle[i],
                offset:new AMap.Pixel(-12, -10),
                position: lnglat,
                extData: i,
              });
            }
            this.markersShip[i].on('click',this.chooseShip);
        }

      },
      //选择船
      chooseShip(e) {
        let lnglat = new AMap.LngLat(e.target.getPosition().getLng(),e.target.getPosition().getLat());
        map.setCenter(lnglat);
        this.shipChooseId = e.target.getExtData();
        // console.log(this.shipChooseId);
      },
      //初始化图标
      initIcon(){
        if (this.pointType === 0){
          this.icon = new AMap.Icon({
            image: roadIcon,
            imageSize: new AMap.Size(18, 18),
          })
        }else if (this.pointType === 1){
          this.icon = new AMap.Icon({
            image: waterIcon,
            imageSize: new AMap.Size(18, 18),
          })
        }else if (this.pointType === 2){
          this.icon = new AMap.Icon({
            image: areaIcon,
            imageSize: new AMap.Size(18, 18),
          })
        }else if (this.pointType === 3){
          this.icon = new AMap.Icon({
            image: areaRoadIcon,
            imageSize: new AMap.Size(18, 18),
          })
        }
      },
      //初始化边界障碍
      initBoundaryAndObstacles(){
        let lnglat;
        let boundspath = [];
        for (let i = 0; i < this.bounds.length; i++) {
          boundspath[i] = new Array();
          for (let j = 0; j < this.bounds[i].length; j++) {
            lnglat = new AMap.LngLat(this.bounds[i][j][0], this.bounds[i][j][1]);
            boundspath[i][j] = lnglat;
          }
          boundary[i] = new AMap.Polygon({
            path: boundspath[i],
            fillColor: '#f4a762', // 多边形填充颜色
            fillOpacity: 0,//多边形透明度
            borderWeight: 2, // 线条宽度，默认为 1
            strokeColor: '#f4a762', // 线条颜色
            bubble: true,
          });
          map.add(boundary[i]);//添加多边形
        }
        //初始化障碍
        for (let i = 0; i < this.obstacles.length; i++) {
          boundspath[i] = new Array();
          for (let j = 0; j < this.obstacles[i].length; j++) {
            lnglat = new AMap.LngLat(this.obstacles[i][j][0], this.obstacles[i][j][1]);
            boundspath[i][j] = lnglat;
          }
          obstacle[i] = new AMap.Polygon({
            path: boundspath[i],
            fillColor: '#ff3d3e', // 多边形填充颜色
            fillOpacity: 0.5,//多边形透明度
            borderWeight: 2, // 线条宽度，默认为 1
            strokeColor: '#ff3d3e', // 线条颜色
            bubble: true,
          });
          map.add(obstacle[i]);//添加多边形
        }
      },
      //初始化所有折线
      initPolyline(){
        polyline = new AMap.Polyline({
          path: path,
          borderWeight: 2, // 线条宽度，默认为 1
          strokeColor: '#61f7f7', // 线条颜色
          lineJoin: 'round' // 折线拐点连接处样式
        });
        polyline.setMap(map);

        waterline = new AMap.Polyline({
          path: path,
          borderWeight: 2, // 线条宽度，默认为 1
          strokeColor: '#d38fff', // 线条颜色
          lineJoin: 'round' // 折线拐点连接处样式
        });
        waterline.setMap(map);

        arealine = new AMap.Polyline({
          path: arealinePath,
          borderWeight: 2, // 线条宽度，默认为 1
          strokeColor: '#61f7f7', // 线条颜色
          lineJoin: 'round' // 折线拐点连接处样式
        });
        arealine.setMap(map);

        cleanline = new AMap.Polyline({
          path: cleanPath,
          borderWeight: 2, // 线条宽度，默认为 1
          strokeColor: '#fff764', // 线条颜色
          lineJoin: 'round' // 折线拐点连接处样式
        });
        cleanline.setMap(map);

        routeLine = new AMap.Polyline({
          path: routeLinePath,
          borderWeight: 2, // 线条宽度，默认为 1
          strokeColor: '#fed90c', // 线条颜色
          lineJoin: 'round' // 折线拐点连接处样式
        })
        routeLine.setMap(map);
      },
      //点击地图标点
      addMarker(e) {
        if (this.pointType !== 0 && this.pointType !== 1 && this.pointType !== 2 && this.pointType !== 3) return; //标点类型既不是一又不是二又不是三不允许标点
        if(this.shipChooseId === -1) return;//未选船不能标点
        console.log(e.lnglat);
        let isPointInRing = this.isPointInRing(e.lnglat);//是否在边界内
        // console.log('点击时'+isPointInRing);
        //console.log('点击地图'+this.pointType);
        if (!isPointInRing) return;//在边界内return
        let pointType = this.pointType;
        //let icon = "";
        let marker;
        if (pointType === 0) {  //标路径点
          marker = new AMap.Marker({
            icon: this.icon,
            map: map,
            offset:new AMap.Pixel(-10, -10),
            position: e.lnglat,
            draggable: true,
            bubble: true,
            extData: pointType,
          });
          this.markers.push(marker);//路径点压入markers实例数组
          path.push(e.lnglat);//坐标压入路径数组
          polyline.setPath(path);//设置路径线的路径
          polyline.setMap(map);//跟新折线实例
          //console.log(polyline.getPath());
          marker.on('dragging', this.moveMarker);//绑定按下事件
          marker.on('mousedown', this.getLngLat);
          marker.on('touchstart', this.getLngLat);
          marker.on('dragend', this.afterDrag);
        } else if (pointType === 1) { //标水质点 基本同路径点
          marker = new AMap.Marker({
            icon: this.icon,
            map: map,
            position: e.lnglat,
            offset:new AMap.Pixel(-10, -10),
            draggable: true,
            bubble: true,
            extData: pointType,
          });
          this.markersWater.push(marker);
          waterPath.push(e.lnglat);
          waterline.setPath(waterPath);
          waterline.setMap(map);
          //console.log(polyline.getPath());
          marker.on('dragging', this.moveMarker);
          marker.on('mousedown', this.getLngLat);
          marker.on('dragend', this.afterDrag);
          marker.on('touchstart', this.getLngLat);
        } else if (pointType === 2) {  //标区域
          marker = new AMap.Marker({
            icon: this.icon,
            map: map,
            position: e.lnglat,
            offset:new AMap.Pixel(-10, -10),
            draggable: true,
            bubble: true,
            extData: pointType,
          });
          //console.log(polyline.getPath());
          this.markersAraeline.push(marker);
          //this.markersArae.push(marker);
          arealinePath.push(e.lnglat);
          //areaPath.push(e.lnglat);
          arealine.setPath(arealinePath);
          arealine.setMap(map);
          marker.on('click', this.addArea);
          marker.on('mousemove', this.afterAddArea);
          marker.on('dragging', this.moveMarker);
          marker.on('mousedown', this.getLngLat);
          marker.on('dragend', this.afterDrag);
          marker.on('touchstart', this.getLngLat);
          //marker.on('dragend',this.moveArea);
        } else if (pointType === 3) {

          marker = new AMap.Marker({
            icon: this.icon,
            map: map,
            position: e.lnglat,
            offset:new AMap.Pixel(-10, -10),
            draggable: true,
            bubble: true,
            extData: pointType,
          });
          this.markersClean.push(marker);//路径点压入markers实例数组
          cleanPath.push(e.lnglat);//坐标压入路径数组
          cleanline.setPath(cleanPath);//设置路径线的路径
          cleanline.setMap(map);//跟新折线实例
          marker.on('dragging', this.moveMarker);//绑定按下事件
          marker.on('mousedown', this.getLngLat);
          marker.on('dragend', this.afterDrag);
          marker.on('touchstart', this.getLngLat);
        }
      },
      //移动标记
      moveMarker(e) {
        let flag = e.target.getExtData();
        if (flag === 0) {   //路径点移动
          path.length = 0;
          let lnglat;
          for (let i = 0; i < this.markers.length; i++) {
            lnglat = new AMap.LngLat(this.markers[i].getPosition().getLng(), this.markers[i].getPosition().getLat());
            path.push(lnglat);
          }
          polyline.setPath(path);
          polyline.setMap(map);
        } else if (flag === 1) {  //水质点移动
          waterPath.length = 0;
          let lnglat;
          for (let i = 0; i < this.markersWater.length; i++) {
            lnglat = new AMap.LngLat(this.markersWater[i].getPosition().getLng(), this.markersWater[i].getPosition().getLat());
            waterPath.push(lnglat);
          }
          waterline.setPath(waterPath);
          waterline.setMap(map);
        } else if (flag === 2) {  //区域移动
          if (this.areaSign === 0) {
            arealinePath.length = 0;
            let lnglat;
            for (let i = 0; i < this.markersAraeline.length; i++) {
              lnglat = new AMap.LngLat(this.markersAraeline[i].getPosition().getLng(), this.markersAraeline[i].getPosition().getLat());
              arealinePath.push(lnglat);
            }
            arealine.setPath(arealinePath);
            arealine.setMap(map);
          } else if (this.areaSign === 1) {
            areaPath.length = 0;
            let lnglat;
            for (let i = 0; i < this.markersArae.length; i++) {
              lnglat = new AMap.LngLat(this.markersArae[i].getPosition().getLng(), this.markersArae[i].getPosition().getLat());
              areaPath.push(lnglat);
            }
            polygon.setPath(areaPath);
            polygon.setMap(map);
          }
        } else if (flag === 3) {
          cleanPath.length = 0;
          let lnglat;
          for (let i = 0; i < this.markersClean.length; i++) {
            lnglat = new AMap.LngLat(this.markersClean[i].getPosition().getLng(), this.markersClean[i].getPosition().getLat());
            cleanPath.push(lnglat);
          }
          cleanline.setPath(cleanPath);
          cleanline.setMap(map);
        }
      },
      //区域闭合判断
      addArea(e) {
        if (!this.areaIntersect()) {
          map.off('click', this.addMarker);
          //console.log(e.target.getPosition().getLng());
          console.log(this.markersAraeline.length);
          if (!this.markersAraeline[0]) return;
          if (this.markersAraeline[0].getPosition() === e.target.getPosition()) {
            this.areaSign = 1;
            this.markersArae = this.markersAraeline.slice(0);
            areaPath = arealinePath.slice(0);
            polygon = new AMap.Polygon({
              path: areaPath,
              fillColor: '#dcfffd', // 多边形填充颜色
              fillOpacity: 0.33,
              borderWeight: 2, // 线条宽度，默认为 1
              strokeColor: '#61f7f7', // 线条颜色
            });
            map.add(polygon);//添加多边形
            map.remove(arealine);//移除未闭合时路径线
            copy = this.markersAraeline.slice(0);//保存所有路劲点实例下边删除可用
            //console.log(copy);
            this.markersAraeline.length = 0;
            arealinePath.length = 0;
            //console.log('路径点'+polyline.getPath())
          }
        }
      },
      //若区域未闭合
      afterAddArea(e) {
        if (this.areaSign === 0) {
          map.on('click', this.addMarker)
        }
      },
      //判断点是否在边界和障碍内
      isPointInRing(lnglat) {
        let ismarker = false;
        for (let i = 0; i < boundary.length; i++) { //不能都是false 有一个true就可以返回 表示可以标点
          let isPointInRing = AMap.GeometryUtil.isPointInRing(lnglat, boundary[i].getPath());
          if (isPointInRing) {
            ismarker = true;
            break;
          }
        }
        for (let i = 0; i < obstacle.length; i++) {  //都得是false 有一个true 返回 表示不可以标点
          let isPointInRing = AMap.GeometryUtil.isPointInRing(lnglat, obstacle[i].getPath());
          if (isPointInRing) {
            ismarker = false;
            break;
          }
        }
        return ismarker;
      },
      //获取事件发生的marker的开始位置
      getLngLat(e) {
        copy2[0] = new AMap.LngLat(e.target.getPosition().getLng(), e.target.getPosition().getLat());
        // console.log(copy2[0]);
        if (this.pointType === 0) {
          for (let i = 0; i < this.markers.length; i++) {
            if (e.target === this.markers[i]) {
              copy2[1] = i;
              //console.log(copy[1]);
              break;
            }
          }
        } else if (this.pointType === 1) {
          for (let i = 0; i < this.markersWater.length; i++) {
            if (e.target === this.markersWater[i]) {
              copy2[1] = i;
              console.log(copy2[1]);
              break;
            }
          }
        } else if (this.pointType === 2) {
          if (this.areaSign === 0) {
            for (let i = 0; i < this.markersAraeline.length; i++) {
              if (e.target === this.markersAraeline[i]) {
                copy2[1] = i;
                //console.log(copy[1]);
                break;
              }
            }
          } else if (this.areaSign === 1) {
            for (let i = 0; i < this.markersArae.length; i++) {
              if (e.target === this.markersArae[i]) {
                copy2[1] = i;
                console.log(copy2[1]);
                break;
              }
            }
          }
        } else if (this.pointType === 3) {
          for (let i = 0; i < this.markersClean.length; i++) {
            if (e.target === this.markersClean[i]) {
              copy2[1] = i;
              //console.log(copy[1]);
              break;
            }
          }
        }
      },
      //拖动后处理
      afterDrag(e) {
        let lnglat = new AMap.LngLat(e.target.getPosition().getLng(), e.target.getPosition().getLat());
        let isPointInRing = this.isPointInRing(lnglat);
        // console.log('拖动后' + isPointInRing);
        let areaIntersect = this.areaIntersect();
        // console.log('拖动后' + areaIntersect);
        if (!isPointInRing||areaIntersect) {
          if (this.pointType === 0) {
            path.length = 0;
            this.markers[copy2[1]].setPosition(copy2[0]);
            let lnglat2;
            for (let i = 0; i < this.markers.length; i++) {
              lnglat2 = new AMap.LngLat(this.markers[i].getPosition().getLng(), this.markers[i].getPosition().getLat());
              path.push(lnglat2);
            }
            polyline.setPath(path);
            polyline.setMap(map);
          } else if (this.pointType === 1) {
            waterPath.length = 0;
            this.markersWater[copy2[1]].setPosition(copy2[0]);
            let lnglat2;
            for (let i = 0; i < this.markersWater.length; i++) {
              lnglat2 = new AMap.LngLat(this.markersWater[i].getPosition().getLng(), this.markersWater[i].getPosition().getLat());
              waterPath.push(lnglat2);
            }
            waterline.setPath(waterPath);
            waterline.setMap(map);
          } else if (this.pointType === 2) {
            if (this.areaSign === 0) {
              arealinePath.length = 0;
              this.markersAraeline[copy2[1]].setPosition(copy2[0]);
              let lnglat2;
              for (let i = 0; i < this.markersAraeline.length; i++) {
                lnglat2 = new AMap.LngLat(this.markersAraeline[i].getPosition().getLng(), this.markersAraeline[i].getPosition().getLat());
                arealinePath.push(lnglat2);
              }
              arealine.setPath(arealinePath);
              arealine.setMap(map);
            } else if (this.areaSign === 1) {
              areaPath.length = 0;
              this.markersArae[copy2[1]].setPosition(copy2[0]);
              let lnglat2;
              for (let i = 0; i < this.markersArae.length; i++) {
                lnglat2 = new AMap.LngLat(this.markersArae[i].getPosition().getLng(), this.markersArae[i].getPosition().getLat());
                areaPath.push(lnglat2);
              }

              polygon.setPath(areaPath);
              polygon.setMap(map);
            }
          } else if (this.pointType === 3) {
            cleanPath.length = 0;
            this.markersClean[copy2[1]].setPosition(copy2[0]);
            let lnglat2;
            for (let i = 0; i < this.markersClean.length; i++) {
              lnglat2 = new AMap.LngLat(this.markersClean[i].getPosition().getLng(), this.markersClean[i].getPosition().getLat());
              cleanPath.push(lnglat2);
            }
            cleanline.setPath(cleanPath);
            cleanline.setMap(map);
          }
        }
      },
      //开始任务构造输出数据
      constructorData(Type){
        let pathData = '';
        let areaData = '';
        if (Type === 1&&this.pointType === 0){
          console.log(Type);
          if (this.markers.length === 0){
            console.log('巡航路径为空1');
            return
          } else  {
            for (let i = 0; i < this.markers.length; i++) {
              pathData = pathData + this.markers[i].getPosition().getLng() + ',' + this.markers[i].getPosition().getLat() + ';';
            }
          }
          this.$store.commit("root",pathData);
          this.activeTaskList[this.shipChooseId] ='0;'+pathData;
          console.log("zhegelaile")
          console.log(pathData);
        } else if (Type === 2&&this.pointType === 1){
          if (this.markersWater.length === 0){
            console.log('水质路径为空');
            return
          } else {
            for (let i = 0; i < this.markersWater.length; i++) {
              pathData = pathData + this.markersWater[i].getPosition().getLng() + ',' + this.markersWater[i].getPosition().getLat() + ';';
            }
          }
          console.log(pathData);
          this.$store.commit("root",pathData);
          this.activeTaskList[this.shipChooseId] = '1;'+pathData;
        } else  if (Type === 3&&(this.pointType === 2||this.pointType === 3)){
          if (this.areaSign === 0 ){
            console.log('区域未闭合无法开始任务');
            this.$store.commit('area',"");
            return;
          } else if (this.markersClean.length === 0) {
            this.$store.commit('area',areaPath);
            console.log('未规划路劲');
          }else {
            for (let i=0;i<this.markersClean.length;i++){
              pathData = pathData+this.markersClean[i].getPosition().getLng()+','+this.markersClean[i].getPosition().getLat()+';';
            }
            for (let i=0;i<this.markersArae.length;i++){
              areaData = areaData+this.markersArae[i].getPosition().getLng()+','+this.markersArae[i].getPosition().getLat()+';';
            }
            areaData = areaData+this.markersArae[0].getPosition().getLng()+','+this.markersArae[0].getPosition().getLat()+';';
            console.log(pathData);
            console.log(areaData);
            this.$store.commit("root",pathData);
            this.$store.commit("area",areaData);
            pathData = '';
            for (let i=this.markersClean.length-1;i>-1;i--){
              pathData = pathData+this.markersClean[i].getPosition().getLng()+','+this.markersClean[i].getPosition().getLat()+';';
            }
            pathData = '2;'+areaData+pathData;
            this.activeTaskList[this.shipChooseId] = pathData;
          }
        }else{
          return
        }
      },
      //保存任务构造输出数据
      saveTaskData(Type){
        let pathData = '';
        let areaData = '';
        if (Type === 1&&this.pointType === 0){
          if (this.markers.length === 0){
            console.log('巡航路径为空1');
            return
          } else  {
            for (let i = 0; i < this.markers.length; i++) {
              pathData = pathData + this.markers[i].getPosition().getLng() + ',' + this.markers[i].getPosition().getLat() + ';';
            }
          }
          this.$store.commit("saveTaskRoot",pathData);
        } else if (Type === 2&&this.pointType === 1){
          if (this.markersWater.length === 0){
            console.log('水质路径为空');
            return
          } else {
            for (let i = 0; i < this.markersWater.length; i++) {
              pathData = pathData + this.markersWater[i].getPosition().getLng() + ',' + this.markersWater[i].getPosition().getLat() + ';';
            }
          }
          this.$store.commit("saveTaskRoot",pathData);
        } else  if (Type === 3&&(this.pointType === 2||this.pointType === 3)){
          if (this.areaSign === 0 ){
            console.log('区域未闭合无法开始任务');
            return;
          } else if (this.markersClean.length === 0) {
            console.log('未规划路劲');
          }else {
            for (let i=0;i<this.markersClean.length;i++){
              pathData = pathData+this.markersClean[i].getPosition().getLng()+','+this.markersClean[i].getPosition().getLat()+';';
            }
            for (let i=0;i<this.markersArae.length;i++){
              areaData = areaData+this.markersArae[i].getPosition().getLng()+','+this.markersArae[i].getPosition().getLat()+';';
            }
            areaData = areaData+this.markersArae[0].getPosition().getLng()+','+this.markersArae[0].getPosition().getLat()+';';
            this.$store.commit("saveTaskRoot",pathData);
            this.$store.commit("saveTaskarea",areaData);
          }
        }else{
          return
        }
      },
      //判断清洁区域是否有交点
      areaIntersect(){
        let areaIntersect = false;
        let lnglat1;
        let lnglat2;
        let lnglat3;
        let lnglat4;
        for (let i=0;i<this.markersAraeline.length-3;i++){
          lnglat1 = new AMap.LngLat(this.markersAraeline[i].getPosition().getLng(),this.markersAraeline[i].getPosition().getLat());
          lnglat2 = new AMap.LngLat(this.markersAraeline[i+1].getPosition().getLng(),this.markersAraeline[i+1].getPosition().getLat());
          for (let j=i+2;j<this.markersAraeline.length-1;j++){
            lnglat3 = new AMap.LngLat(this.markersAraeline[j].getPosition().getLng(),this.markersAraeline[j].getPosition().getLat());
            lnglat4 = new AMap.LngLat(this.markersAraeline[j+1].getPosition().getLng(),this.markersAraeline[j+1].getPosition().getLat());
            areaIntersect = AMap.GeometryUtil.doesSegmentsIntersect(lnglat1, lnglat2, lnglat3, lnglat4);
            if (areaIntersect) {
              console.log('交线');
              console.log((i+1) + '  ' + (i+2));
              console.log((j+1) + '  ' + (j+2));
              return areaIntersect
            }
          }
        }
        if (this.markersAraeline.length !== 0 ) {
          lnglat1 = new AMap.LngLat(this.markersAraeline[0].getPosition().getLng(), this.markersAraeline[0].getPosition().getLat());
          lnglat2 = new AMap.LngLat(this.markersAraeline[this.markersAraeline.length - 1].getPosition().getLng(), this.markersAraeline[this.markersAraeline.length - 1].getPosition().getLat());
          for (let i = 1; i < this.markersArae.length - 2; i++) {
            lnglat3 = new AMap.LngLat(this.markersAraeline[i].getPosition().getLng(), this.markersAraeline[i].getPosition().getLat());
            lnglat4 = new AMap.LngLat(this.markersAraeline[i + 1].getPosition().getLng(), this.markersArae[i + 1].getPosition().getLat());
            areaIntersect = AMap.GeometryUtil.doesSegmentsIntersect(lnglat1, lnglat2, lnglat3, lnglat4);
            if (areaIntersect) {
              console.log('交线');
              console.log((i + 1) + '  ' + (i + 2));
              return areaIntersect
            }
          }
        }
        for (let i=0;i<this.markersArae.length-3;i++){
          lnglat1 = new AMap.LngLat(this.markersArae[i].getPosition().getLng(),this.markersArae[i].getPosition().getLat());
          lnglat2 = new AMap.LngLat(this.markersArae[i+1].getPosition().getLng(),this.markersArae[i+1].getPosition().getLat());
          for (let j=i+2;j<this.markersArae.length-1;j++){
            lnglat3 = new AMap.LngLat(this.markersArae[j].getPosition().getLng(),this.markersArae[j].getPosition().getLat());
            lnglat4 = new AMap.LngLat(this.markersArae[j+1].getPosition().getLng(),this.markersArae[j+1].getPosition().getLat());
            areaIntersect = AMap.GeometryUtil.doesSegmentsIntersect(lnglat1, lnglat2, lnglat3, lnglat4);
            if (areaIntersect) {
              console.log('交线');
              console.log((i+1) + '  ' + (i+2));
              console.log((j+1) + '  ' + (j+2));
              return areaIntersect
            }
          }
        }
        if (this.markersArae.length !== 0 ) {
          lnglat1 = new AMap.LngLat(this.markersArae[0].getPosition().getLng(), this.markersArae[0].getPosition().getLat());
          lnglat2 = new AMap.LngLat(this.markersArae[this.markersArae.length - 1].getPosition().getLng(), this.markersArae[this.markersArae.length - 1].getPosition().getLat());
          for (let i = 1; i < this.markersArae.length - 2; i++) {
            lnglat3 = new AMap.LngLat(this.markersArae[i].getPosition().getLng(), this.markersArae[i].getPosition().getLat());
            lnglat4 = new AMap.LngLat(this.markersArae[i + 1].getPosition().getLng(), this.markersArae[i + 1].getPosition().getLat());
            areaIntersect = AMap.GeometryUtil.doesSegmentsIntersect(lnglat1, lnglat2, lnglat3, lnglat4);
            if (areaIntersect) {
              console.log('交线');
              console.log((i + 1) + '  ' + (i + 2));
              //console.log((j + 1) + '  ' + (j + 2));
              return areaIntersect
            }
          }
        }
        return false;
      },
      //数据转化1;a,b;这种数据类型转化为AMap.LngLat数组 不返回1 用在重现任务
      parseData(lnglat){
        lnglat = lnglat.slice(1,lnglat.length);
        for (let i=0;i<lnglat.length;i++){
          lnglat[i] = lnglat[i].split(",");
          lnglat[i][0] = parseFloat(lnglat[i][0]);
          lnglat[i][1] = parseFloat(lnglat[i][1]);
          lnglat[i] = new AMap.LngLat(lnglat[i][0],lnglat[i][1]);
        }
        return lnglat;
      },
      //任务重现
      loadActiveTask(activeTask){
        let marker;
        let lnglat = activeTask.split(";");
        lnglat.length = lnglat.length-1;
        if (lnglat[0] === '0'){
          this.$store.commit("signMethod",0);
          this.$store.commit("canSign",0);
          this.icon = new AMap.Icon({
            image: roadIcon,
            imageSize: new AMap.Size(18, 18),
          });
          lnglat = this.parseData(lnglat);
          for (let i=0;i<lnglat.length;i++){
            marker = new AMap.Marker({
              icon: this.icon,
              map: map,
              offset:new AMap.Pixel(-10, -10),
              position: lnglat[i],
              draggable: false,
              bubble: true,
              extData: 0,
            });
            this.markers.push(marker);//路径点压入markers实例数组
            path.push(lnglat[i]);//坐标压入路径数组
            polyline.setPath(path);//设置路径线的路径
            polyline.setMap(map);//跟新折线实例
          }
        }else if (lnglat[0] === '1'){
          this.$store.commit("signMethod",1);
          this.$store.commit("canSign",0);
          this.icon = new AMap.Icon({
            image: waterIcon,
            imageSize: new AMap.Size(18, 18),
          });
          lnglat = this.parseData(lnglat);
          for (let i=0;i<lnglat.length;i++){
            marker = new AMap.Marker({
              icon: this.icon,
              map: map,
              offset:new AMap.Pixel(-10, -10),
              position: lnglat[i],
              draggable: false,
              bubble: true,
              extData: 1,
            });
            this.markersWater.push(marker);//路径点压入markers实例数组
            waterPath.push(lnglat[i]);//坐标压入路径数组
            waterline.setPath(waterPath);//设置路径线的路径
            waterline.setMap(map);//跟新折线实例
          }
        }else if (lnglat[0] === '2') {
          this.$store.commit("signMethod",3);
          this.$store.commit("canSign",0);
          this.icon = new AMap.Icon({
            image: areaRoadIcon,
            imageSize: new AMap.Size(18, 18),
          });
          lnglat = this.parseData(lnglat);
          for (let i=0;i<lnglat.length;i++){
            marker = new AMap.Marker({
              icon: this.icon,
              map: map,
              offset:new AMap.Pixel(-10, -10),
              position: lnglat[i],
              draggable: false,
              bubble: true,
              extData: 1,
            });
            this.markersClean.push(marker);//路径点压入markers实例数组
            cleanPath.push(lnglat[i]);//坐标压入路径数组
            cleanline.setPath(cleanPath);//设置路径线的路径
            cleanline.setMap(map);//跟新折线实例
          }
        }

      },
      change(){
        let lat = this.$store.getters.curr_lat;
        let tem = lat[1]+0.00001;
        tem = Math.floor(tem * 10000000) / 10000000;
        lat.splice(1,1,tem);
        tem = lat[0]+0.00001;
        tem = Math.floor(tem * 10000000) / 10000000;
        lat.splice(0,1,tem);
        this.$store.commit('curr_lat',lat);
      },
    },
    computed: {
      pointType() {
        return this.$store.getters.signMethod
      },
      isdel() {
        return this.$store.getters.canDelete
      },
      ship(){
        return this.getShipLngLat();
      },
      shipRoad(){
        return 0;
      },
      shipChooseId :{
        get(){
          return this.$store.getters.shipChooseId;
        },
        set(shipId){
          console.log(shipId);
          this.$store.commit('shipChooseId',shipId);
        }
      },
      shipAngle(){
        return this.$store.getters.curr_yaw
      },
      shipState(){
        return this.$store.getters.curr_state
      },
      startTask(){
        return this.$store.getters.startTask
      },
      saveRoute(){
        return this.$store.getters.saveRoute
      },
      canSign(){
        return this.$store.getters.canSign;
      },
      bounds(){
        let lnglat = [];
        let tem;
        let j = 0;
        for (let i= 0;i<this.$store.getters.boundsAndObstacles.length;i++){
          tem = this.$store.getters.boundsAndObstacles[i].split(';');
          if (tem[0] === 'b'){
            tem = tem.slice(1,tem.length-1);
            lnglat[j] = tem;
            j++;
          }
        }
        for (let i=0;i<j;i++){
          for (let k=0;k<lnglat[i].length;k++){
            lnglat[i][k] = lnglat[i][k].split(',');
            lnglat[i][k][0] = parseFloat(lnglat[i][k][0]);
            lnglat[i][k][1] = parseFloat(lnglat[i][k][1]);
          }
        }
        return lnglat;
      },
      obstacles(){
        let lnglat = [];
        let tem;
        let j = 0;
        for (let i= 0;i<this.$store.getters.boundsAndObstacles.length;i++){
          tem = this.$store.getters.boundsAndObstacles[i].split(';');
          if (tem[0] === 'o'){
            tem = tem.slice(1,tem.length-1);
            lnglat[j] = tem;
            j++;
          }
        }
        for (let i=0;i<j;i++){
          for (let k=0;k<lnglat[i].length;k++){
            lnglat[i][k] = lnglat[i][k].split(',');
            lnglat[i][k][0] = parseFloat(lnglat[i][k][0]);
            lnglat[i][k][1] = parseFloat(lnglat[i][k][1]);
          }
        }
        return lnglat;
      },

    },
    watch: {
      //监听类型变化
      pointType(newType, oldType) {
        this.$store.commit('canSign',1);
        if (newType !== -1){
          this.initIcon();
        }
        if (oldType === 1) {
          map.remove(waterline);
          map.remove(this.markersWater);
          this.markersWater.length = 0;
          waterPath.length = 0;
        } else if (oldType === 0) {
          map.remove(polyline);
          map.remove(this.markers);
          this.markers.length = 0;
          path.length = 0;
        } else if (oldType === 2&&newType !== 3) {
          if (this.markersClean.length !== 0){
            map.remove(cleanline);
            map.remove(this.markersClean);
            this.markersClean.length = 0;
            cleanPath.length = 0;
          }
          if (this.areaSign === 0) {
            map.remove(arealine);
            map.remove(this.markersAraeline);
            this.markersAraeline.length = 0;
            arealinePath.length = 0;
          } else if (this.areaSign === 1) {
            map.remove(polygon);
            map.remove(this.markersArae);
            areaPath.length = 0;
            this.markersArae.length = 0;
            copy.length = 0;
            this.areaSign = 0;
            map.on('click', this.addMarker)
          }
        }else if (oldType === 3&&newType !==2){
          map.remove(cleanline);
          map.remove(this.markersClean);
          this.markersClean.length = 0;
          cleanPath.length = 0;
          if (this.areaSign === 0) {
            map.remove(arealine);
            map.remove(this.markersAraeline);
            this.markersAraeline.length = 0;
            arealinePath.length = 0;
          } else if (this.areaSign === 1) {
            map.remove(polygon);
            map.remove(this.markersArae);
            areaPath.length = 0;
            this.markersArae.length = 0;
            copy.length = 0;
            this.areaSign = 0;
            map.on('click', this.addMarker)
          }
        }

        if (newType === 2){
          for(let i = 0;i< this.markersClean.length;i++) {
            this.markersClean[i].off('dragging', this.moveMarker);//绑定按下事件
            this.markersClean[i].off('mousedown', this.getLngLat);
            this.markersClean[i].off('dragend', this.afterDrag);
            this.markersClean[i].off('touchstart', this.getLngLat);
            this.markersClean[i].setDraggable(false);
          }
          for(let i = 0;i< this.markersArae.length;i++){
            this.markersArae[i].on('click', this.addArea);
            this.markersArae[i].on('mousemove', this.afterAddArea);
            this.markersArae[i].on('dragging', this.moveMarker);
            this.markersArae[i].on('mousedown', this.getLngLat);
            this.markersArae[i].on('dragend', this.afterDrag);
            this.markersArae[i].on('touchstart', this.getLngLat);
            this.markersArae[i].setDraggable(true);
          }
        } else if(newType === 3){
          for(let i = 0;i< this.markersArae.length;i++){
            this.markersArae[i].off('dragging', this.moveMarker);//绑定按下事件
            this.markersArae[i].off('mousedown', this.getLngLat);
            this.markersArae[i].off('dragend', this.afterDrag);
            this.markersArae[i].off('touchstart', this.getLngLat);
            this.markersArae[i].setDraggable(false);
          }
          for(let i = 0;i< this.markersClean.length;i++){
            this.markersClean[i].on('click', this.addArea);
            this.markersClean[i].on('mousemove', this.afterAddArea);
            this.markersClean[i].on('dragging', this.moveMarker);
            this.markersClean[i].on('mousedown', this.getLngLat);
            this.markersClean[i].on('dragend', this.afterDrag);
            this.markersClean[i].on('touchstart', this.getLngLat);
            this.markersClean[i].setDraggable(true);
          }
        }
      },
      //监听删除
      isdel(newIs, oldIs) {
        console.log('删除');
        //等于1撤销
        if (newIs % 2 === 1) {
          map.on('click', this.addMarker);
          if (this.pointType === 0) {
            if (this.markers.length === 0) return;
            this.markers[this.markers.length - 1].setMap(null);
            this.markers.pop();
            path.pop();
            polyline.setPath(path);
            polyline.setMap(map);
          } else if (this.pointType === 1) {
            if (this.markersWater.length === 0) return;
            this.markersWater[this.markersWater.length - 1].setMap(null);
            this.markersWater.pop();
            waterPath.pop();
            waterline.setPath(waterPath);
            waterline.setMap(map);
          } else if (this.pointType === 2) {
            if (this.markersAraeline.length === 0 && this.markersArae.length === 0) return;
            if (this.areaSign === 1) {
              this.markersArae.length = 0;
              areaPath.length = 0;
              map.remove(polygon);
              map.remove(copy);
              map.remove(arealine);//防止意外将未闭合的路径线相关均重新移除
              this.markersAraeline.length = 0;
              arealinePath.length = 0;
              this.areaSign = 0;
              ;
            } else {
              this.markersAraeline[this.markersAraeline.length - 1].setMap(null);
              this.markersAraeline.pop();
              //this.markersArae.pop();
              //areaPath.pop();
              arealinePath.pop();
              arealine.setPath(arealinePath);
              arealine.setMap(map);
            }
          } else if (this.pointType === 3) {
            if (this.markersClean.length === 0) return;
            this.markersClean[this.markersClean.length - 1].setMap(null);
            this.markersClean.pop();
            cleanPath.pop();
            cleanline.setPath(cleanPath);
            cleanline.setMap(map);
          }
        } else if (newIs % 2 === 0) {  //等于0全部删除
          if (this.pointType === 1) {
            map.remove(waterline);
            map.remove(this.markersWater);
            this.markersWater.length = 0;
            waterPath.length = 0;
          } else if (this.pointType === 0) {
            map.remove(polyline);
            map.remove(this.markers);
            this.markers.length = 0;
            path.length = 0;
          } else if (this.pointType === 2) {
            if (this.areaSign === 0) {
              map.remove(arealine);
              map.remove(this.markersAraeline);
              this.markersAraeline.length = 0;
              arealinePath.length = 0;
            } else if (this.areaSign === 1) {
              map.remove(polygon);
              map.remove(this.markersArae);
              areaPath.length = 0;
              this.markersArae.length = 0;
              copy.length = 0;
              this.areaSign = 0;
              map.on('click', this.addMarker)
            }
          } else if (this.pointType === 3) {
            map.remove(cleanline);
            map.remove(this.markersClean);
            this.markersClean.length = 0;
            cleanPath.length = 0;
          }
        }
      },
      //监听船坐标变化
      ship(newShip, oldShip){
        this.initShip();
        let routePath = this.$store.getters.shipRoad;
        for (let i=0;i<newShip.length;i++){
            if (!routePath[i]){
                routePath[i] = [];
            }else {
              routePath[i].push(newShip[i]);
            }
        }
        this.$store.commit("shipRoad",routePath);
        for (let i=0;i<routePath[this.shipChooseId].length;i++){
          routeLinePath[i] = new AMap.LngLat(routePath[this.shipChooseId][i][0],routePath[this.shipChooseId][i][1]);
        }
        routeLine.setPath(routeLinePath);
        console.log('路劲线')
        console.log(routeLinePath);
        console.log('======================================')
        routeLine.setMap(map);
      },
      //监听船角度变化
      shipAngle(newAngle,oldAngle){
        this.initShip();
      },
      //监听当前所选船的变化
      shipChooseId(newId,oldId){
        let lnglat = new AMap.LngLat(this.ship[newId][0],this.ship[newId][1]);
        map.setCenter(lnglat);
        let icon = new AMap.Icon({
          image: shipIcon2,
          imageSize: new AMap.Size(25, 25),
        });
        this.markersShip[newId].setIcon(icon);
        if (oldId !== -1){
          let icon = new AMap.Icon({
            image: shipIcon,
            imageSize: new AMap.Size(25, 25),
          });
          this.markersShip[oldId].setIcon(icon);
        }
        if (this.pointType === -1){
          return
        }else if (this.pointType === 0){
          map.remove(polyline);
          map.remove(this.markers);
          this.markers.length = 0;
          path.length = 0;
        }else if (this.pointType === 1){
          map.remove(waterline);
          map.remove(this.markersWater);
          this.markersWater.length = 0;
          waterPath.length = 0;
        } else if (this.pointType === 2||this.pointType === 3) {
          if (this.markersClean.length !== 0){
            map.remove(cleanline);
            map.remove(this.markersClean);
            this.markersClean.length = 0;
            cleanPath.length = 0;
          }
          if (this.areaSign === 0) {
            map.remove(arealine);
            map.remove(this.markersAraeline);
            this.markersAraeline.length = 0;
            arealinePath.length = 0;
          } else if (this.areaSign === 1) {
            map.remove(polygon);
            map.remove(this.markersArae);
            areaPath.length = 0;
            this.markersArae.length = 0;
            copy.length = 0;
            this.areaSign = 0;
            map.on('click', this.addMarker)
          }
        }
        if(this.$store.getters.activeTask[newId]){
          let activeTask = this.$store.getters.activeTask[newId];
          this.loadActiveTask(activeTask);
        }
        let routePath = this.$store.getters.shipRoad;
        for (let i=0;i<routePath[newId].length;i++){
          routeLinePath[i] = new AMap.LngLat(routePath[newId][i][0],routePath[newId][i][1]);
        }
        routeLine.setPath(routeLinePath);
        routeLine.setMap(map);
      },
      //监听船状态
      // shipState(newState,oldState){
      //   console.log('状态更新');
      //   let tem = this.$store.getters.activeTask;
      //   delete tem[newState];
      //   this.$store.commit('activeTask',tem);
      //   console.log(this.$store.getters.activeTask);
      //   console.log('状态更新完毕');
      // },
      //监听开始任务
      startTask(newTask,oldTask){
        console.log('开始任务');
        this.constructorData(newTask[0]);
        this.$store.commit('activeTask',this.activeTaskList);
        console.log(this.$store.getters.activeTask);
      },
      //监听是否可以标点
      canSign(newSign,oldSign){
        if (newSign === 0){
          map.off('click',this.addMarker)
        } else if (newSign === 1){
          map.on('click',this.addMarker)
        }
      },
      //监听保存任务
      saveRoute(newRoute,oldRoute){
        console.log('保存任务');
        this.saveTaskData(newRoute[0]);
      },
    }
  }
</script>
