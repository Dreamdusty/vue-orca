$j(document).ready(function () {
  socket = new WebSocket("ws://vps.orca-tech.cn:9001");
  socket.onopen = function () {
    socket.send("&ship_id;" + shipid + "#");
    socket.send("&total_ship;" + totalship + "#");
  }
  socket.onclose = function () {
    alert("请检查网络，与服务器的连接已断开！")
  }

  //服务器发送数据时进行的更新
  socket.onmessage = function (msg) {
    console.log(msg.data);
    var topic = msg.data.split(";")[0];
    if(topic === "test;"){
      return;
    }
    var user = topic.split("/")[1];
    var ship = parseInt(topic.split("/")[2]);
    var topicContent = topic.split("/")[3];
    if(user.toString() !== shipid){
      return;
    }
    if (topicContent === "ACK"){
      var info = msg.data.split(";")[1];
      if(info === "$ACK1#"){
        sendFlag -= 1;
      }
    }
    else if (topicContent === "BASIC") {
      var info = msg.data.split(";")[1];
      info = JSON.parse(info);
      lat = parseFloat(info.lat);
      lng = parseFloat(info.lng);
      //判断是否再中国境内，通过经纬度进行判断，如果不在中国境内表面数据无效
      if (parseFloat(lng) >= 73 && parseFloat(lng) <= 135 && parseFloat(lat) >= 4.25 && parseFloat(lat) <= 53.5) {
        allShipLat[ship] = lat;
        allShipLng[ship] = lng;
        var shipState = allShipState[ship];
        allShipState[ship] = info.state;
        allShipMarker[ship].setAngle(parseInt(info.yaw));
        allShipYaw[ship] = (parseInt(info.yaw)).toString() + "度";
        allShipPercen[ship] = (info.pd_percent).toString() + "%";
        allShipRemaTime[ship] = ((Math.floor(parseInt(info.pd_rematime)/60/60)).toString() +"小时" + (Math.floor(parseInt(info.pd_rematime)/60%60)).toString() + "分钟");
        allShipCurrStr[ship] = ((parseFloat(info.pd_current) * 24 / 1000).toString() + "W");
        allShipSpeed[ship] = ((info.speed).toString() + "m/s");
        allShipStars[ship] = info.stars;
        if(info.state == "-4" && info.state != shipState){
          endTime = new Date();
          shipState++;
          hour = Math.floor((endTime-startTime)/1000/3600)
          mininte = Math.floor((endTime-startTime)/1000%3600/60)
          second = Math.floor((endTime-startTime)/1000%3600%60)
          alert("本次导航结束，用时" + hour +"小时"+mininte+"分钟"+second+"秒");
        }
        // allShipTemperater[ship] = info.temperature;
        // allShipError[ship] = info.err;
        // allShipRouteId[ship] = info.route_id;
        allShipMarker[parseInt(ship)].setPosition([allShipLng[ship], allShipLat[ship]])
        if (flagTrack == 0) {
          while (track[ship].length != 0) {
            track[ship].pop();
          }
        }
        else {
          track[ship].push([allShipLng[ship], allShipLat[ship]]);
        }
        if (id === ship) {
          $j("#bottomShipLngStr").text(allShipLng[id]);
          $j("#bottomShipLatstr").text(allShipLat[id]);
          $j("#bottomShipYawStr").text(allShipYaw[id]);
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
          $j("#bottomShipPercenStr").text(allShipPercen[id]);
          $j("#bottomShipRemaTimeStr").text(allShipRemaTime[id]);
          $j("#bottomShipCurrStr").text(allShipCurrStr[id]);
          $j("#bottomShipSpeedStr").text(allShipSpeed[id]);
          $j("#bottomShipStarsStr").text(allShipStars[id]);
          $j("#bottomShipTimeStr").text(allShipTime[id]);
          routeTrack.setPath(track[id]);
          routeTrack.setMap(map);
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

        }
      }
    }
    else if (topicContent == "WQ"){
      if(allWaterMarker[id].length == 0){
        return;
      }
      var position1 = allWaterMarker[id][wqNumberCurr].getPosition();
      var info = msg.data.split(";")[1];
      info = JSON.parse(info);
      var position2 = [info.lng,info.lat];
      var dis = AMap.GeometryUtil.distance(position1, position2);
      if (dis <= 3){
        ec += info.ec + ",";
        console.log(info);
        temper +=  info.temperature + ",";
        console.log("ec" + info.ec);
        console.log("temper" + info.temperature);
        wqNumberCurr++;
      }


    }
  }
});
