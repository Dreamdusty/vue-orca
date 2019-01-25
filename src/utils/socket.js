import { getCookie } from "./cookie";
import {setCookie} from "./cookie";
import {changeState} from "./cookie";
import variable from './global/variable'
import store from '../store'
let webSocket = null;
let global_callback = null;
let send = null;
let receive =[];
let clean =[];
let data = '&lnglat;108.897001,34.248031;108.897339,34.248022;6;1#';
/*
let data=[[{108.897001,34.248031;108.897339,34.248022;}
  [108.897301,34.248368],
  [108.896711,34.248399],
  [108.896673,34.247388],];
*/
let data2 ='&lnglat;[[1.012,2],[3,4],[5,6],[7,8],[9,0],]#';
// 发送的指令
const stopM = '$B;0#';
const recoverM = '$B;1#';
const endM = '$B;2#';
const backM = '$C;#';


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
 // console.log("打印的回调"+global_callback);
}


/*
发送区域点
data 是一个对象数组
 */
function sendAreaPoint(id,area,clean){
  data ="&lnglat;"+area+clean+";"+id+"#";
  sendSocket(data);
}
function getReceive(id){
  return receive[id];
}
function setReceive(id,data){
  receive[id]=data;
}
function getClean(id){
  return clean[id];
}
function setClean(id,data){
  clean[id]=data;
}
function start(id){
  let data = '$A;'+id+'#';
  sendSocket(data);
}
function changeShip(id){
  let data = '&id'+';'+id+'#';
  sendSocket(data);
}
function end(){
  sendSocket(endM);
}
function back(){
  sendSocket(backM);
}
function stop(){
  sendSocket(stopM);
}
function recover(){
  sendSocket(recoverM);
}




function rechange(data){
  let temp="";  //缓存想要写回去的字符串
  let count=0;
  console.log("接收"+data);
  //这个代码要改，不能存二维数组，应该直接直接变为字符串
  let id = parseInt(data[data.length-2]);
  for(let i=8;i<data.length-4;i++){
    if(data[i]!=="["&&data[i]!=="]") {
      if (data[i] !== ",") {
        temp += data[i];
      } else if (data[i] === ',') {
        if (count % 2 === 0 ) {
          temp += ",";
          count++;
        } else {
         // console.log("ccc"+count);
          temp += ";";
          count++;
        }
      }
    }
  }
  temp = temp.substring(0,temp.length-1);
  clean[id]=data[data.length-4];
  receive[id]=temp;
  console.log("打印"+receive[id]);

}
// 数据接收
function socketMessage(e) {
  if (e.data.indexOf('&lnglat') === 0){
    console.log('这里执行了吗');
    rechange(e.data);
    //console.log("1111111"+receive);
  }else{
    let topic = e.data.split(';')[0];
    let msg = e.data.split(';')[1];

    let user = topic.split("/")[1];
    let ship = topic.split("/")[2];
    let topicContent = topic.split("/")[3];//当前的主题名

    if(topicContent==="BASIC"){ // if(getCookie('account')===data.ship_id){//用户对不
      let data = JSON.parse(msg);
      //更新所有的变量。

      let temp = store.getters.curr_state;
      if(temp[ship]!==data.state){
        if(data.temp===0){
          store.commit('finishTaskShip',ship);
        }
        temp.splice(ship,1,data.state);
        store.commit("curr_state",temp);
      }
      temp = store.getters.curr_lat;
      if(temp[ship]!==data.lat){
        temp.splice(ship,1,data.lat);
        store.commit("curr_lat",temp);
      }

      temp = store.getters.curr_lng;
      if(temp[ship]!==data.lng){
        temp.splice(ship,1,data.lng);
        store.commit("curr_lng",temp);
      }
      temp = store.getters.curr_yaw;
      if(temp[ship]!==data.yaw){
        temp.splice(ship,1,data.yaw);
        store.commit("curr_yaw",temp);
      }
      temp = store.getters.curr_battle;
      if(temp[ship]!=data.pd_current){
        temp.splice(ship,1,data.pd_current);
        store.commit("curr_battle",temp);
      }
      temp = store.getters.curr_speed;
      if(temp[ship]!=data.speed){
        temp.splice(ship,1,data.speed);
        store.commit("curr_speed",temp);
      }
      temp = store.getters.rame_time;
      if(temp[ship]!==data.pd_rematime){
        temp.splice(ship,1,data.pd_rematime);
        store.commit("rame_time",temp);
      }
      temp = store.getters.curr_percen;
      if(temp[ship]!==data.pd_percent){
        temp.splice(ship,1,data.pd_percent);
        store.commit("curr_percen",temp);
      }
    }
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
//sendSocket(data);
//sendAreaPoint(data);
// rechange(data);
// sendAreaPoint(data);
export { sendSocket,start,end,stop,recover,back,changeShip,sendAreaPoint,getReceive,setReceive,getClean,setClean}
