import { getCookie } from "./cookie";

let webSocket = null;
let global_callback = null;
let send = null;
let receive = null;
let data=[[1,2],[3,4],[5,6],[7,8],[9,0]];

// 初始化socket
function initWebSocket() {
  webSocket = new WebSocket('ws://vps.orca-tech.cn:9001');
  webSocket.onmessage = function (e) {//接收消息
    socketMessage(e);
  };
  webSocket.onclose = function () {
    socketClose();
  };
  webSocket.onopen = function () {
    socketOpen();
  };
  webSocket.onerror = function () {
    this.$toast('socket连接发生错误！');
  }
}

// 实际调用的方法
function sendSocket(agentData, callback) {
  global_callback = callback;
  if (webSocket.readyState === webSocket.OPEN) {
    // 若是socket开启状态
    socketSend(agentData);
  } else if (webSocket.readyState === webSocket.CONNECTING) {
    // 若是正在开启状态，则等待1s后重新调用
    setTimeout(function () {
      sendSocket(agentData, callback);
    }, 1000);
  } else {
    // 若未开启，则等待1s后重新调用
      setTimeout(function () {
      sendSocket(agentData, callback);
    }, 1000);
  }
}


/*
发送区域点
data 是一个对象数组
 */
function sendAreaPoint(data){
  change(data);
  sendSocket(send);

}
//将相关形式
function change(data){
  send ="&lnglat;[";
  //先实现二维数组扁平化
  let data2 = data.reduce(function(previous,current){
      return previous.concat(current);
  },[]);

  data2.forEach(function(v,k){
    if(k%2===0){
      send+="["+v;
    }else{
      send+=","+v+"],"
    }
  })
  send+="]#";
  console.log(send);
}

// 数据接收
function socketMessage(e) {
  global_callback(JSON.parse(e.data));
}

// 数据发送
function socketSend(e) {
  webSocket.send(e);
}

// 关闭
function socketClose() {
  // this.$toast('请检查网络，与服务器的连接已断开！');
}

// 打开
function socketOpen() {//就是说当前用户的信息是保存在cookie里面的
  socketSend('&ship_id;' + getCookie('shipId') + '#');
  socketSend('&total_ship;' + getCookie('totalShip') + '#');
}



//在这里面写发送的请求：
//直接发命令就行了，但还得写到数据库里面

//initWebSocket();
change(data);

export { sendSocket }
