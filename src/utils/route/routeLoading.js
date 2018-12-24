
$j(document).ready(function () {
  $j("#bottomShipSpeedSlider").slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 100,
    value: 60,
    slide: function (event, ui) {
      sendSpeed.push(ui.value);
      if(isSpeed == 0){
        isSpeed = 1;
        setTimeout(function(){
          socket.send("$ORDER,6,%" + sendSpeed.pop() + "#")
          isSpeed = 0;
          while(sendSpeed.length != 0){
            sendSpeed.pop()
          }
        },1000)
      }

    }
  });
  if (Cookies.get("username")) {
    $j("#navUserName").text(Cookies.get("username"));
  }
  // 建立同服务器的链接


  // 从数据库中获取对应账户的船只信息
  $j.post("http://orca-tech.cn/app/data_select.php",
    {
      ship_id: shipid,
    },

    function (data, status) {
      data = JSON.parse(data);
      data = data.data;
      for (var i in data) {
        allShipLat.push(data[i].lat);
        allShipLng.push(data[i].lng);
        allShipName.push(data[i].name);
        allShipYaw.push(parseInt(data[i].yaw).toString() + "度");
        allShipState.push(data[i].state);
        allShipPercen.push(parseInt(data[i].pd_percent).toString() + "%");
        allShipRemaTime.push((Math.floor(parseInt(data[i].pd_rematime)/60/60)).toString() +"小时" + (Math.floor(parseInt(data[i].pd_rematime)/60%60)).toString() + "分钟");
        allShipCurrStr.push((parseFloat(data[i].pd_current) * 24 / 1000).toString() + "W");
        allShipSpeed.push((data[i].speed).toString() + "m/s");
        allShipStars.push(data[i].stars);
        allShipTime.push(data[i].time);
        allRouteMarker.push(new Array());
        allRouteMarkerPosition.push(new Array());
        allWaterMarker.push(new Array());
      }

      for (var i in data) {
        var marker = new AMap.Marker({
          map: map,
          icon: "../image/image1/ship.png",
          position: [allShipLng[i], allShipLat[i]],
          draggable: false,
          extData: i
        });
        marker.on("click",clickShipMarker);
        allShipMarker.push(marker);
        track.push(new Array());
        console.log(allShipName[i]);
        var shipName = "<li><a id=\"bottomShipId" + i.toString()
          + "\" class='btn btn-link btn-link btn-block btn-ship-choosed'>" + allShipName[i] + "</a></li>";
        $j("#bottomChooseShip").append(shipName);
      }
      //填充对应位置的信息
      $j("#bottomShipNameStr").text(allShipName[0]);
      $j("#bottomShipLngStr").text(allShipLng[0]);
      $j("#bottomShipLatstr").text(allShipLat[0]);
      $j("#bottomShipYawStr").text(allShipYaw[0]);
      if(allShipState[id] == "0"){
        $j("#bottomShipStateStr").text("在线");
      }
      else if(allShipState[id] == "-2" || allShipState[id] == "-3"){
        $j("#bottomShipStateStr").text("暂停");
      }
      else if(allShipState[id] == "-4"){
        $j("#bottomShipStateStr").text("导航结束");
      }
      else if(parseInt(allShipState[id]) > 0){
        $j("#bottomShipStateStr").text("第"+ parseInt(allShipState[id]) +"圈");
      }
      $j("#bottomShipPercenStr").text(allShipPercen[0]);
      $j("#bottomShipRemaTimeStr").text(allShipRemaTime[0]);
      $j("#bottomShipCurrStr").text(allShipCurrStr[0]);
      $j("#bottomShipSpeedStr").text(allShipSpeed[0]);
      $j("#bottomShipStarsStr").text(allShipStars[0]);
      $j("#bottomShipTimeStr").text(allShipTime[0]);

    })


})


//点击船名时进行选取船只

$j("body").delegate(".btn-ship-choosed", "click", function () {
  var choosedShipName = $j(this).attr("id");
  var choosedShipId = parseInt(choosedShipName.slice(12, choosedShipName.length));
  id = choosedShipId;                                                   //选取当前船只的船号
  map.setCenter(allShipMarker[choosedShipId].getPosition())
  setTimeout(function(){
    for (var i in allShipMarker) {
      if (i != choosedShipId) {
        allShipMarker[i].setIcon("../image/image1/ship.png");
      }
      else {
        console.log(i);
        allShipMarker[i].setIcon("../image/image1/selectShip.png");
      }
    }
  },100)

  for (var i in allRouteMarker[id]) {
    allRouteMarker[id][i].setMap(map);
  }
  routeLine.setPath(allRouteMarkerPosition[id]);
  routeLine.setMap(map);
  map.on('click', getLnglat);
  $j("#bottomShipNameStr").text(allShipName[choosedShipId]);
  $j("#bottomShipLngStr").text(allShipLng[choosedShipId]);
  $j("#bottomShipLatstr").text(allShipLat[choosedShipId]);
  $j("#bottomShipYawStr").text(allShipYaw[choosedShipId]);
  if(allShipState[id] == "0"){
    $j("#bottomShipStateStr").text("在线");
  }
  else if(allShipState[id] == "-2" || allShipState[id] == "-3"){
    $j("#bottomShipStateStr").text("暂停");
  }
  else if(allShipState[id] == "-4"){
    $j("#bottomShipStateStr").text("导航结束");
  }
  else if(parseInt(allShipState[id]) > 0){
    $j("#bottomShipStateStr").text("第"+ parseInt(allShipState[id]) +"圈");
  }
  $j("#bottomShipPercenStr").text(allShipPercen[choosedShipId]);
  $j("#bottomShipRemaTimeStr").text(allShipRemaTime[choosedShipId]);
  $j("#bottomShipCurrStr").text(allShipCurrStr[choosedShipId]);
  $j("#bottomShipSpeedStr").text(allShipSpeed[choosedShipId]);
  $j("#bottomShipStarsStr").text(allShipStars[choosedShipId]);
  $j("#bottomShipTimeStr").text(allShipTime[choosedShipId]);
  socket.send("&id;" + choosedShipId + "#");

  setTimeout(function () {
    $j("#bottomShipInformation").toggle("fade");
    $j("#bottomShipPre").toggle("fade")
  }, 500);
  $j("#bottomChooseShip").toggle("fade");
  $j("#bottomShipChoose h5").text("船只信息");

  if(allShipState[id] == "0"){
    $j("#bottomOperateStart").removeAttr("disabled");
    $j("#bottomOperateStop2Go").attr("disabled","disabled");
    $j("#bottomOperateReturn").removeAttr("disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateClear").attr("disabled","disabled");
    $j("#bottomOperateEditor").removeAttr("disabled");
    $j("#bottomOperateRoute").attr("disabled","disabled");
  }
  else if(allShipState[id] == "-1"){

    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").removeAttr("disabled");
    $j("#bottomOperateImgStop2Go").attr("src","image/控制按钮1/控制按钮-57.png");
    $j("#bottomOperateWordStop2Go").text("暂停");
    $j("#bottomOperateReturn").removeAttr("disabled");
    $j("#bottomOperateClear").removeAttr("disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateEditor").removeAttr("disabled","disabled");
    $j("#bottomOperateRoute").removeAttr("disabled");

  }
  else if(allShipState[id] == "-2"){

    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").removeAttr("disabled");
    $j("#bottomOperateImgStop2Go").attr("src","image/第二页/第二页/开始-48.png");
    $j("#bottomOperateWordStop2Go").text("继续");
    $j("#bottomOperateReturn").removeAttr("disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateClear").removeAttr("disabled");
    $j("#bottomOperateEditor").attr("disabled","disabled");
    $j("#bottomOperateRoute").removeAttr("disabled");

  }
  else if(allShipState[id] == "-3"){
    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").removeAttr("disabled");
    $j("#bottomOperateImgStop2Go").attr("src","image/第二页/第二页/开始-48.png");
    $j("#bottomOperateWordStop2Go").text("继续");
    $j("#bottomOperateReturn").removeAttr("disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateClear").removeAttr("disabled");
    $j("#bottomOperateEditor").attr("disabled","disabled");
    $j("#bottomOperateRoute").removeAttr("disabled");

  }
  else if(allShipState[id] == "-4"){
    $j("#bottomOperateStart").removeAttr("disabled");
    $j("#bottomOperateStop2Go").attr("disabled","disabled");
    $j("#bottomOperateReturn").attr("disabled","disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateClear").attr("disabled","disabled");
    $j("#bottomOperateEditor").removeAttr("disabled");
    $j("#bottomOperateRoute").attr("disabled","disabled");

  }
  else if(allShipState[id] == "-5"){
    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").attr("disabled","disabled");
    $j("#bottomOperateReturn").attr("disabled","disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateClear").removeAttr("disabled");
    $j("#bottomOperateEditor").attr("disabled","disabled");
    $j("#bottomOperateRoute").attr("disabled","disabled");
  }
  else if(allShipState[id] == "-10"){
    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").attr("disabled","disabled");
    $j("#bottomOperateReturn").attr("disabled","disabled");
    $j("#bottomOperateSpeed").attr("disabled","disabled");
    $j("#bottomOperateClear").attr("disabled","disabled");
    $j("#bottomOperateEditor").attr("disabled","disabled");
    $j("#bottomOperateRoute").attr("disabled","disabled");

  }
  else if(allShipState[id] == "-11"){
    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").attr("disabled","disabled");
    $j("#bottomOperateReturn").attr("disabled","disabled");
    $j("#bottomOperateSpeed").attr("disabled","disabled");
    $j("#bottomOperateClear").attr("disabled","disabled");
    $j("#bottomOperateEditor").attr("disabled","disabled");
    $j("#bottomOperateRoute").attr("disabled","disabled");
  }
  else{
    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").removeAttr("disabled");
    $j("#bottomOperateImgStop2Go").attr("src","image/控制按钮1/控制按钮-57.png");
    $j("#bottomOperateWordStop2Go").text("暂停");
    $j("#bottomOperateReturn").removeAttr("disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateClear").removeAttr("disabled");
    $j("#bottomOperateEditor").attr("disabled","disabled");
    $j("#bottomOperateRoute").removeAttr("disabled");

  }
});

$j("body").delegate("#bottomShipPre", "click", function () {
  $j("#bottomShipInformation").toggle("fade");
  setTimeout(function () {
    $j("#bottomChooseShip").toggle("fade");
  }, 500)
  $j("#bottomShipPre").toggle("fade")
  for (var i in allRouteMarker[id]) {
    allRouteMarker[id][i].setMap(null);
  }
  routeLine.setMap(null);
  $j("#bottomShipChoose h5").text("选取船只");
  id = -1;
  $j("#bottomOperateStart").attr("disabled","disabled");
  $j("#bottomOperateStop2Go").attr("disabled","disabled");
  $j("#bottomOperateReturn").attr("disabled","disabled");
  $j("#bottomOperateSpeed").attr("disabled","disabled");
  $j("#bottomOperateClear").attr("disabled","disabled");
  $j("#bottomOperateEditor").attr("disabled","disabled");
  $j("#bottomOperateRoute").attr("disabled","disabled");

})

function clickShipMarker(){

  var choosedShipId = this.getExtData();
  id = choosedShipId;
  for(var i in allShipMarker){
    if(i != choosedShipId){
      allShipMarker[i].setIcon("../image/image1/ship.png");
      $j("#bottomShipId" + i).css("background-color","rgb(26,52,75)");
    }
    else{
      allShipMarker[i].setIcon("../image/image1/selectShip.png");
      $j("#bottomShipId" + i).css("background-color","rgb(68,113,146)");
    }
  }


  $j("#bottomShipNameStr").text(allShipName[choosedShipId]);
  $j("#bottomShipLngStr").text(allShipLng[choosedShipId]);
  $j("#bottomShipLatstr").text(allShipLat[choosedShipId]);
  $j("#bottomShipYawStr").text(allShipYaw[choosedShipId]);
  if(allShipState[id] == "0"){
    $j("#bottomShipStateStr").text("在线");
  }
  else if(allShipState[id] == "-2" || allShipState[id] == "-3"){
    $j("#bottomShipStateStr").text("暂停");
  }
  else if(allShipState[id] == "-4"){
    $j("#bottomShipStateStr").text("导航结束");
  }
  else if(parseInt(allShipState[id]) > 0){
    $j("#bottomShipStateStr").text("第"+ parseInt(allShipState[id]) +"圈");
  }
  $j("#bottomShipPercenStr").text(allShipPercen[choosedShipId]);
  $j("#bottomShipRemaTimeStr").text(allShipRemaTime[choosedShipId]);
  $j("#bottomShipCurrStr").text(allShipCurrStr[choosedShipId]);
  $j("#bottomShipSpeedStr").text(allShipSpeed[choosedShipId]);
  $j("#bottomShipStarsStr").text(allShipStars[choosedShipId]);
  $j("#bottomShipTimeStr").text(allShipTime[choosedShipId]);
  socket.send("&id;" + choosedShipId + "#");
  map.setCenter(allShipMarker[choosedShipId].getPosition())
  map.on('click', getLnglat);
  setTimeout(function () {
    $j("#bottomShipInformation").show("fade");
    $j("#bottomShipPre").show("fade")
  }, 300);
  $j("#bottomChooseShip").hide("fade");
  $j("#bottomShipChoose h5").text("船只信息");
  if(allShipState[choosedShipId] == "0"){
    $j("#bottomOperateStart").removeAttr("disabled");
    $j("#bottomOperateStop2Go").attr("disabled","disabled");
    $j("#bottomOperateReturn").removeAttr("disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateClear").attr("disabled","disabled");
    $j("#bottomOperateEditor").removeAttr("disabled");
    $j("#bottomOperateRoute").attr("disabled","disabled");
  }
  else if(allShipState[choosedShipId] == "-1"){

    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").removeAttr("disabled");
    $j("#bottomOperateImgStop2Go").attr("src","image/控制按钮1/控制按钮-57.png");
    $j("#bottomOperateWordStop2Go").text("暂停");
    $j("#bottomOperateReturn").removeAttr("disabled");
    $j("#bottomOperateClear").removeAttr("disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateEditor").removeAttr("disabled","disabled");
    $j("#bottomOperateRoute").removeAttr("disabled");

  }
  else if(allShipState[choosedShipId] == "-2"){

    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").removeAttr("disabled");
    $j("#bottomOperateImgStop2Go").attr("src","image/第二页/第二页/开始-48.png");
    $j("#bottomOperateWordStop2Go").text("继续");
    $j("#bottomOperateReturn").removeAttr("disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateClear").removeAttr("disabled");
    $j("#bottomOperateEditor").attr("disabled","disabled");
    $j("#bottomOperateRoute").removeAttr("disabled");

  }
  else if(allShipState[choosedShipId] == "-3"){
    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").removeAttr("disabled");
    $j("#bottomOperateImgStop2Go").attr("src","image/第二页/第二页/开始-48.png");
    $j("#bottomOperateWordStop2Go").text("继续");
    $j("#bottomOperateReturn").removeAttr("disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateClear").removeAttr("disabled");
    $j("#bottomOperateEditor").attr("disabled","disabled");
    $j("#bottomOperateRoute").removeAttr("disabled");

  }
  else if(allShipState[choosedShipId] == "-4"){
    $j("#bottomOperateStart").removeAttr("disabled");
    $j("#bottomOperateStop2Go").attr("disabled","disabled");
    $j("#bottomOperateReturn").attr("disabled","disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateClear").attr("disabled","disabled");
    $j("#bottomOperateEditor").removeAttr("disabled");
    $j("#bottomOperateRoute").attr("disabled","disabled");

  }
  else if(allShipState[choosedShipId] == "-5"){
    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").attr("disabled","disabled");
    $j("#bottomOperateReturn").attr("disabled","disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateClear").removeAttr("disabled");
    $j("#bottomOperateEditor").attr("disabled","disabled");
    $j("#bottomOperateRoute").attr("disabled","disabled");
  }
  else if(allShipState[choosedShipId] == "-10"){
    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").attr("disabled","disabled");
    $j("#bottomOperateReturn").attr("disabled","disabled");
    $j("#bottomOperateSpeed").attr("disabled","disabled");
    $j("#bottomOperateClear").attr("disabled","disabled");
    $j("#bottomOperateEditor").attr("disabled","disabled");
    $j("#bottomOperateRoute").attr("disabled","disabled");

  }
  else if(allShipState[choosedShipId] == "-11"){
    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").attr("disabled","disabled");
    $j("#bottomOperateReturn").attr("disabled","disabled");
    $j("#bottomOperateSpeed").attr("disabled","disabled");
    $j("#bottomOperateClear").attr("disabled","disabled");
    $j("#bottomOperateEditor").attr("disabled","disabled");
    $j("#bottomOperateRoute").attr("disabled","disabled");
  }
  else{
    $j("#bottomOperateStart").attr("disabled","disabled");
    $j("#bottomOperateStop2Go").removeAttr("disabled");
    $j("#bottomOperateImgStop2Go").attr("src","image/控制按钮1/控制按钮-57.png");
    $j("#bottomOperateWordStop2Go").text("暂停");
    $j("#bottomOperateReturn").removeAttr("disabled");
    $j("#bottomOperateSpeed").removeAttr("disabled");
    $j("#bottomOperateClear").removeAttr("disabled");
    $j("#bottomOperateEditor").attr("disabled","disabled");
    $j("#bottomOperateRoute").removeAttr("disabled");

  }
}
