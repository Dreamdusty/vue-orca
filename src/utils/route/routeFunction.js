$j("#bottomOperateStop2Go").click(function(){
  if(id == -1){
    alert("请先选取一艘船");
  }
  else{
    var btnName = $j("#bottomOperateImgStop2Go").attr("src");
    if(btnName == "image/控制按钮1/控制按钮-57.png"){
      socket.send("$STOP#");
      $j( "#progressbar" ).progressbar( "value", false );
      $j("#modelResult").text("发送中");
      $j("#modelResult").css("color","grey");
      window.setTimeout("timeout()",2000);
      sendFlag = 1;
      $j("#myModal2").modal('toggle');
    }
    else{
      socket.send("$GO#");
      $j( "#progressbar" ).progressbar( "value", false );
      $j("#modelResult").text("发送中");
      $j("#modelResult").css("color","grey");
      window.setTimeout("timeout()",2000);
      sendFlag = 1;
      $j("#myModal2").modal('toggle');
    }
  }
})



$j("#bottomOperateClear").click(function(){
  if(id == -1){
    alert("请先选取一艘船");
  }
  else{
    socket.send("$CLEAR#");
    $j( "#progressbar" ).progressbar( "value", false );
    $j("#modelResult").text("发送中");
    $j("#modelResult").css("color","grey");
    window.setTimeout("timeout()",2000);
    sendFlag = 1;
    $j("#myModal2").modal('toggle');
  }
});



$j("#bottomOperateEditor").click(function(){
  if(id == -1){
    alert("请先选取一艘船");
  }
  else{
    $j( "#bottomBarrierAndBorder" ).toggle( "blind" ,{direction:"down"});
  }
});

$j("#bottomOperateReturn").click(function(){
  if(id == -1){
    alert("请先选取一艘船");
  }
  else{
    socket.send("$ORDER,2#");
    $j( "#progressbar" ).progressbar( "value", false );
    $j("#modelResult").text("发送中");
    $j("#modelResult").css("color","grey");
    sendFlag = 1;
    window.setTimeout("timeout()",2000);
    $j("#myModal2").modal('toggle');
  }
});

$j("#bottomOperateSpeed").click(function(){
  if(id == -1){
    alert("请先选取一艘船");
  }
  else{
    $j( "#bottomShipSpeedSlider" ).toggle( "blind" ,{direction:"down"});
  }
});

$j("#bottomShipLine").click(function(){
  if(id == -1){
    alert("请先选取一艘船");
  }
  else{
    socket.send("$NAV,1#");
    $j( "#progressbar" ).progressbar( "value", false );
    $j("#modelResult").text("发送中");
    $j("#modelResult").css("color","grey");
    sendFlag = 1;
    window.setTimeout("timeout()",2000);
    $j("#myModal2").modal('toggle');
    $j("#bottomShipLine").css("background-color","rgb(68,113,146)");
    $j("#bottomShipLoop").css("background-color","rgb(26,52,75)");
  }
})

$j("#bottomShipLoop").click(function(){
  if(id == -1){
    alert("请先选取一艘船");
  }
  else{
    socket.send("$NAV,2#");
    $j( "#progressbar" ).progressbar( "value", false );
    $j("#modelResult").text("发送中");
    $j("#modelResult").css("color","grey");
    sendFlag = 1;
    window.setTimeout("timeout()",2000);
    $j("#bottomShipLoop").css("background-color","rgb(68,113,146)");
    $j("#bottomShipLine").css("background-color","rgb(26,52,75)");
    $j("#myModal2").modal('toggle');

  }
})

$j("#bottomPointDelete").click(function(){
  if(allRouteMarker[id].length == 0){
    alert("请先标点");
  }
  else{
    console.log(allRouteMarkerPosition[id].length)
    console.log(allRouteMarker[id].length)
    if(allRouteMarkerPosition[id].length != allRouteMarker[id].length){
      allRouteMarkerPosition[id].pop();
      routeLine.setPath(allRouteMarkerPosition[id]);
      return;
    }

    allRouteMarkerPosition[id].pop();
    var marker = allRouteMarker[id].pop();
    marker.setMap(null);
    routeLine.setPath(allRouteMarkerPosition[id]);
    pointLabelType = pointLabelType.slice(0,pointLabelType.length - 1);
    routeLine.setMap(map);
  }
})

$j("#bottomOperateRoute").click(function(){
  if(id == -1){
    alert("请先选取一艘船");
  }
  else{
    if(flagTrack == 0){
      flagTrack = 1;
      alert("路径开始显示");
    }
    else{
      flagTrack = 0;
      routeTrack.setMap(null);
      for (var i in Track){
        while(Track[i].length != 0){
          Track[i].pop();
        }
      }
      alert("路径关闭显示");
    }
  }
})

$j("#bottomOperateStart").click(function(){
  if(id == -1){
    alert("请先选取一艘船");
  }
  else{
    socket.send("$CLEAR#");
    position = 0;
    while(allRouteMarkerLngLat.length!=0){
      allRouteMarkerLngLat.pop()
    }
    var labelType = parseInt(pointLabelType,2);
    console.log(pointLabelType);
    for (var i in allRouteMarkerPosition[id]){
      x = allRouteMarkerPosition[id][i].getLng();
      y = allRouteMarkerPosition[id][i].getLat();
      allRouteMarkerLngLat.push(y.toString()+","+x.toString());
    }
    t = window.setTimeout("gps_route_send(allRouteMarkerLngLat,position,allRouteMarkerLngLat.length,pointLabelType)",500);
    $j( "#progressbar" ).progressbar( "value", false );
    $j("#modelResult").text("发送中");
    $j("#modelResult").css("color","grey");
    sendFlag = allRouteMarkerLngLat.length;
    window.setTimeout("timeout()",1200*allRouteMarkerLngLat.length);
    startTime = new Date();
    $j("#myModal2").modal('toggle');
  }
});

$j("#")

function gps_route_send(data,position,sum_position,pointLabelType){
  if (position < sum_position){
    console.log(pointLabelType[position]);
    if(pointLabelType[position] == "0"){
      socket.send("$GNGGA,"+data[position]+"#");
    }
    else{
      socket.send("$GNGGB,"+data[position]+"#");
    }
    t = window.setTimeout("gps_route_send(allRouteMarkerLngLat," + (position + 1) + "," + sum_position + ", pointLabelType)",500);
  }
  else if (position == sum_position){
    socket.send("$NAV,1#")
  }
}


function timeout(){
  if(parseInt(sendFlag) > 0){
    console.log("ok");
    $j("#modelResult").text("发送失败");
    $j("#modelResult").css("color","red");
    $j( "#progressbar" ).progressbar( "value", 100 );
  }
  else{
    $j("#modelResult").text("发送成功");
    $j("#modelResult").css("color","green");
    $j( "#progressbar" ).progressbar( "value", 100 );
  }
  window.setTimeout("close()",1000);
}

function close(){
  $j("#myModal2").modal('hide');
}
