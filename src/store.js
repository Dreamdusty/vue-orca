import Vue from 'vue'
import Vuex from 'vuex'
import {getCookie} from "./utils/cookie";

Vue.use(Vuex);

const state = {
  cruiseShow: false,
  cleanShow: false,
  detectShow: false,
  canSign:-1,
  signMethod:-1,
  canDelete:0,
  shipChooseId:-1,//当前船的id
  startTask:[0,0],  //第一位类型，第二位是状态位
  root:[],
  area:[],
  curr_state:[0,0,0],
  curr_lat:[],
  curr_lng:[],
  curr_yaw:[],
  curr_percen:[],//当前电量的百分比
  rame_time:[],//剩余时间
  curr_battle:[],//当前电量
  curr_speed:[],//当前船速
};

export default new Vuex.Store({
  state,
  getters: {
    cruiseShow: state => {
      return state.cruiseShow; // 让外界能获取 show
    },
    cleanShow: state => {
      return state.cleanShow;
    },
    detectShow: state => {
      return state.detectShow;
    },
    canSign: state => {
      return state.canSign;
    },
    signMethod: state => {
      return state.signMethod;
    },
    canDelete: state => {
      return state.canDelete;
    },
    shipChooseId:state =>{
      return state.shipChooseId;
    },
    startTask:state => {
      return state.startTask;
    },
    root:state => {
      return state.root;
    },
    area:state => {
      return state.area;
    },
    curr_state:state => {
      return state.curr_state;
    },
    curr_lat:state => {
      return state.curr_lat;
    },
    curr_lng:state => {
      return state.curr_lng;
    },
    curr_yaw:state => {
      return state.curr_yaw;
    },
    curr_percen:state => {
      return state.curr_percen;
    },
    rame_time:state => {
      return state.rame_time;
    },
    curr_battle:state => {
      return state.curr_percen;
    },
    curr_speed:state => {
      return state.rame_time;
    },

  },
  mutations: {
    cruiseShow (state, value) { // 让外界能改变 show
      if (value !== undefined) {
        state.cruiseShow = value;
      } else {
        state.cruiseShow = !state.cruiseShow;
      }
    },
    cleanShow (state, value) {
      if (value !== undefined) {
        state.cleanShow = value;
      } else {
        state.cleanShow = !state.cleanShow;
      }
    },
    detectShow (state, value) {
      if (value !== undefined) {
        state.detectShow = value;
      } else {
        state.detectShow = !state.detectShow;
      }
    },
    canSign (state, value) {
      if (value !== undefined) {
        state.canSign = value;
      } else {
        state.cansign  = !state.cansign;
      }
    },
    signMethod (state, value) {
      if (value !== undefined) {
        state.signMethod = value;
      } else {
        state.signMethod = !state.signMethod;
      }
    },
    canDelete (state, value) {
      if (value !== undefined) {
        state.canDelete = value;
      } else {
        state.canDelete = !state.canDelete;
      }
    },
    shipChooseId(state,value){
      if(value !== undefined){
        state.shipChooseId = value;
      }else{
        state.shipChooseId = !state.shipChooseId;
      }

    },
    startTask(state,value){
      if(value !== undefined){
        state.startTask = value;
      }else{
        state.startTask = !state.startTask;
      }

    },
    root(state,value){
      if(value !== undefined){
        state.root = value;
      }else{
        state.root = !state.root;
      }

    },
    area(state,value){
      if(value !== undefined){
        state.area = value;
      }else{
        state.area = !state.area;
      }

    },
    curr_state(state,value){
      if(value !== undefined){
        state.curr_state = value;
      }else{
        state.curr_state = !state.curr_state;
      }
    },
    curr_lng(state,value){
      if(value !== undefined){
        state.curr_lng = value;
      }else{
        state.curr_lng = !state.curr_lng;
      }
    },
    curr_yaw(state,value){
      if(value !== undefined){
        state.curr_yaw = value;
      }else{
        state.curr_yaw = !state.curr_yaw;
      }
    },
    curr_lat(state,value){
      if(value !== undefined){
        state.curr_lat = value;
      }else{
        state.curr_lat = !state.curr_lat;
      }
    },
    curr_percen(state,value){
      if(value !== undefined){
        state.curr_percen = value;
      }else{
        state.curr_percen = !state.curr_percen;
      }
    },
    rame_time(state,value){
      if(value !== undefined){
        state.rame_time = value;
      }else{
        state.rame_time = !state.rame_time;
      }
    },
    curr_battle(state,value){
      if(value !== undefined){
        state.curr_battle = value;
      }else{
        state.curr_battle = !state.curr_battle;
      }
    },
    curr_speed(state,value){
      if(value !== undefined){
        state.curr_speed = value;
      }else{
        state.curr_speed = !state.curr_speed;
      }
    },


  },
  actions: { // 让外界能通过异步调用的方式 改变 show
    cruiseShow ({commit}) {
      commit('cruiseShow');
    },
    cleanShow ({commit}) {
      commit('cleanShow');
    },
    detectShow ({commit}) {
      commit('detectShow');
    },
    canSign ({commit}) {
      commit('canSign');
    },
    signMethod ({commit}) {
      commit('signMethod');
    },
    canDelete ({commit}) {
      commit('canDelete');
    },
    shipChooseId ({commit}) {
      commit('shipId');
    },
    startTask ({commit}) {
      commit('startTask');
    },
    root ({commit}) {
      commit('root');
    },
    area ({commit}) {
      commit('area');
    },
    curr_state ({commit}) {
      commit('curr_state');
    },
    curr_lat ({commit}) {
      commit('curr_lat');
    },
    curr_lng ({commit}) {
      commit('curr_lng');
    },
    curr_yaw ({commit}) {
      commit('curr_yaw');
    },
    curr_percen ({commit}) {
      commit('curr_percen');
    },
    rame_time ({commit}) {
      commit('rame_time');
    },
    curr_battle ({commit}) {
      commit('curr_battle');
    },
    curr_speed ({commit}) {
      commit('curr_speed');
    },


  }
});
