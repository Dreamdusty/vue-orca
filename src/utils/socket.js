import { getCookie } from "./cookie";
import {setCookie} from "./cookie";
import {changeState} from "./cookie";
import variable from './global/variable'
import store from '../store'
let webSocket = null;
let global_callback = null;
let send = null;
let receive = null;
let data=[[108.897001,34.248031],
  [108.897339,34.248022],
  [108.897301,34.248368],
  [108.896711,34.248399],
  [108.896673,34.247388],];
let data2 ='&lnglat;[[1.012,2],[3,4],[5,6],[7,8],[9,0],]#';
// 初始化socket
let ship_state;
let GPS_lat;
let GPS_lng;
let yaw;
let percen;
let Rema_time;
let curr;
let speed;
let stars;


function initWebSocket() {
  webSocket = new WebSocket('ws://vps.orca-tech.cn:9001');
  webSocket.onmessage = function (e) {//接收消息
    socketMessage(e);
  };
  webSocket.onclose = function () {
    socketClose();
  };
  webSocket.onopen = function () {
    console.log("建立链接");
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
  console.log("打印的回调"+global_callback);
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

function rechange(data){
  receive=[];
  let count=0;
  let string="";
  let num=0;
  let zhong=[];
  for(let i=9;i<data.length-2;i++){
    if(data[i]!=="["&&data[i]!=="]"){
      if(data[i]!==","){
        string+=data[i];
      }else if(string!==""){
        num = parseFloat(string);
        string="";
        zhong.push(num);
        if(count++%2){
          receive.push(zhong);
          console.log(zhong);
          zhong=[];
        }
      }
    }
  }
}
// 数据接收
function socketMessage(e) {
  //从前面发过来的东西如何是
//  global_callback(JSON.parse(e.data));
  let topic = e.data.split(';')[0];
  let msg = e.data.split(';')[1];

  let user = topic.split("/")[1];
  let ship = topic.split("/")[2];
  let topicContent = topic.split("/")[3];//当前的主题名

  if(topicContent==="BASIC"){ // if(getCookie('account')===data.ship_id){//用户对不
    let data = JSON.parse(msg);
    //更新所有的变量。
    let temp = store.getters.curr_state;temp[ship]=data.ship_state;store.commit("curr_state",temp);
    temp = store.getters.curr_lat;temp[ship]=data.GPS.lat;store.commit("curr_lat",temp);
    temp = store.getters.curr_lng;temp[ship]=data.GPS.lng;store.commit("curr_lng",temp);
    temp = store.getters.curr_yaw;temp[ship]=data.yaw;store.commit("curr_yaw",temp);
    temp = store.getters.curr_battle;temp[ship]=data.curr;store.commit("curr_battle",temp);
    temp = store.getters.curr_speed;temp[ship]=data.speed;store.commit("curr_speed",temp);
    temp = store.getters.rame_time;temp[ship]=data.Rema_time;store.commit("rame_time",temp);
    temp = store.getters.curr_percen;temp[ship]=data.percen;store.commit("curr_percen",temp);
  }

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

  socketSend('&ship_id;' +5 + '#');
  socketSend('&total_ship;' + 5 + '#');
}



//在这里面写发送的请求：
//直接发命令就行了，但还得写到数据库里面

 initWebSocket();
// //rechange(data2);
// sendAreaPoint(data);
export { sendSocket }
