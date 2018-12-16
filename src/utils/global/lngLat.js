// import Vue from 'vue'
//
// // const data = {
// //   allBorder: [],
// //   allBorderList: [],
// //   allBarrier: [],
// //   allBarrierList: [],
// //   allRouteMarker: [],
// // };
//
// function getLngLat (e, pointType) {
//   console.log(e);
//   console.log(pointType);
//   let num = this.allRouteMarker[id].length;
//   let flag = "";
//   let flagBarrier = false;
//   for (let i in this.allBorder) {
//     flag = this.rayCasting(e.lnglat, this.allBorder[i]);
//     if (flag) {
//       break;
//     }
//   }
//   for (let i in this.allBarrier) {
//     flagBarrier = this.rayBarrier(e.lnglat, this.allBarrier[i],num);
//     if (flagBarrier) {
//       break;
//     }
//   }
//   if (!flag) {
//     alert("请在边界内部标点");
//   }
//   if (flag && !flagBarrier) {
//     let icon = "";
//     let marker;
//     if (pointType === 0) {
//       icon = "../../image/image2/导航点.png";
//       marker = new AMap.Marker({
//         icon: icon,
//         map: map,
//         position: e.lnglat,
//         draggable: true,
//         bubble: true,
//         extData: pointType,
//         title: "第" + (this.data.allRouteMarker[id].length-allWaterMarker[id].length+1).toString() + "个导航点",
//       });
//     } else if (pointType === 1) {
//       icon = "../../image/image2/水质点.png";
//       marker = new AMap.Marker({
//         icon: icon,
//         map: map,
//         position: e.lnglat,
//         draggable: true,
//         bubble: true,
//         extData: pointType,
//         title: "第" + (allWaterMarker[id].length+1).toString() + "个水质点",
//       });
//     }
//     if (pointType === 0) {
//       pointLabelType += "0";
//     } else if (pointType === 1) {
//       allWaterMarker[id].push(marker);
//       pointLabelType += "1";
//       wqNumber++;
//     }
//     num++;
//     this.allRouteMarker[id].push(marker);
//     allRouteMarkerPosition[id].push(e.lnglat);
//     marker.on('click',joinFirst);
//     marker.on('dragging',routeEdit);
//     routeLine.setPath(allRouteMarkerPosition[id]);
//     routeLine.setMap(map);
//   }
// }
//
// exports.install = function (Vue, options) {
//   Vue.prototype.$LngLat = getLngLat(options);
// };
