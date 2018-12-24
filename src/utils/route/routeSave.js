$j("#modelRouteSave").click(function(){
  var routeStr = "";
  for(var i in allRouteMarkerPosition[id]){
    routeStr += allRouteMarkerPosition[id][i].getLat()+","+allRouteMarkerPosition[id][i].getLng()+";";
  }
  var labelStr = parseInt(pointLabelType,2);
  $j.post("http://orca-tech.cn/app/route.php", {
      ship_id: shipid,
      route: routeStr,
      route_name: $j("#modelRouteName").val(),
      type: "insert",
      flag: "1",
      pointType: labelStr,
    },
    function (data, status) {
      alert(data);
      checkedRouteId = parseInt(data.slice(8, data.length));
    });
})
