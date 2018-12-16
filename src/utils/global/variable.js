export default {
  pointLabelType: '',
  wqNumber: 0,
  allBorder: [],
  allBorderList: [],
  allBarrier: [],
  allBarrierList: [],
  allWaterMarker: [],
  allRouteMarker: [],
  allRouteMarkerPosition: [],
  allRouteMarkerBorderPosition: [],
  allRouteMarkerBarrierPosition: [],
  allRouteMarkerLngLat: [],

  setPointLabelType (type) {
    this.pointLabelType += type;
  },
  setWqNumber () {
    this.wqNumber++;
  },
  setAllBorder (border) {
    this.allBorder.push(border);
  },
  setAllBorderList (routeBorder) {
    this.allBorderList.push(routeBorder);
  },
  setAllBarrier (border) {
    this.allBarrier.push(border);
  },
  setAllBarrierList (polygon) {
    this.allBarrierList.push(polygon);
  },
  setAllWaterMarker (id, marker) {
    this.allWaterMarker[id].push(marker);
  },
  setAllRouteMarker (id, marker) {
    this.allRouteMarker[id].push(marker);
  },
  setAllRouteMarkerPosition (id, lngLat) {
    this.allRouteMarkerPosition[id].push(lngLat);
  },
}
