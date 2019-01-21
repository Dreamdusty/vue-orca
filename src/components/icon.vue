<template>
  <div>
    <div class="icon-grid">
      <grid :show-lr-borders="false" :cols="3" >
        <div v-for="icon in icons">
          <grid-item @on-item-click="Handler(icon.name)">
            <img slot="icon" v-bind:src="icon.src" alt="">
            <span slot="label" class="grid-center">{{icon.name}}</span>
          </grid-item>
        </div>
      </grid>
    </div>

    <div v-transfer-dom>
      <popup v-model="cricleShow" position="bottom" height="30%"  @on-hide="closeCricleShow"
      :is-transparent="false"
      :show-mask="false">
        <div class="popup">
          <p style="margin-bottom:30px">请选择循环圈数,最大圈数为5</p>
          <div style="text-align:center;">
            <inline-x-number width="50px" v-model="cricleNum" button-style="round" :max="cricleMax" :min="cricleMin"></inline-x-number>
          </div>
          <x-button type="primary" @click.native="SendCricleNum" style="width:100px;margin-top:30px" >确定</x-button>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="signMethodSelect" position="bottom" height="50%"  @on-hide="closesignMethodSelect"
             :is-transparent="false"
             :show-mask="false">
        <div class="popup">
          <group>
            <checklist :title="'船需要由路径点引导至区域中进行区域清理'" :options="signMethodList" v-model="signMethod" :max="1"></checklist>
          </group>
          <x-button type="primary" @click.native="setSignMethod" style="width:100px;margin-top:30px" >确定</x-button>
        </div>
      </popup>
    </div>
    <!--<div>选择返航方式</div>-->

    <div v-transfer-dom>
      <popup v-model="backMethodSelect" position="bottom" height="50%"  @on-hide="closebackMethodSelect"
             :is-transparent="false"
             :show-mask="false">
        <div class="popup">
          <group>
            <checklist :title="'请选择返航方式'" :options="backMethodList" v-model="backMethod" :max="1"></checklist>
          </group>
          <x-button type="primary" @click.native="setBackMethod" style="width:100px;margin-top:30px" >确定</x-button>
        </div>
      </popup>
    </div>
    <!-- <div>选择检测时间</div>时间范围为5到15秒，用那种表一样的滑动-->
  <!--  <div v-transfer-dom>
      <popup v-model="timeSelect" position="bottom" height="50%"  @on-hide="closeTimeSelect"
             :is-transparent="false"
             :show-mask="false">
        <div class="popup">
          <group-title>这是什么</group-title>
          <picker :data='times' v-model='time'></picker>
          <x-button type="primary" @click.native="setTimeChange" style="width:100px;margin-top:30px" >确定</x-button>
        </div>
      </popup>

    </div>-->




  </div>

</template>

<script>
  import { TabbarItem,TransferDom,Popup,InlineXNumber,XButton,Grid,GridItem,Selector,Group,Popover,Checklist,Picker} from 'vux'

  // let 可以改变值， const 不可改变值
  let sign= {name:'标点', src:'../static/image/logo.png', func: this.fsign};
  //let signRegion = {name:'标点', src:'../static/image/logo.png', func: this.fsign};
  let deleteOne= {name:'撤销',src:'../static/image/logo.png',func:this.fdeleteOne};
  let clear= {name:'清除标点',src:'../static/image/logo.png',func:this.fclear};
  let cricle= {name:'循环圈数',src:'../static/image/logo.png',func:this.fcricle};
  let startTask={name:"开始任务", src:"../static/image/logo.png",func:this.fstartTask};
  let endTask = {name:"结束任务",src:"../static/image/logo.png",func:this.fendTask};
  let stopTask = {name:"暂停任务",src:"../static/image/logo.png",func:this.fstopTask};
  let reStartTask = {name:"继续任务",src:"../static/image/logo.png",func:this.freStartTask};
  let backMethod = {name:"返航方式",src:"../static/image/logo.png",func:this.fbackmethod};
  let startBack = {name:"开始返航",src:"../static/image/logo.png",func:this.fstartBack};
  let endBack = {name:"结束返航",src:"../static/image/logo.png",func:this.fendBack};
  let stopBack = {name:"暂停返航",src:"../static/image/logo.png",func:this.fstopBack};
  let reStartBack = {name:"继续返航",src:".../static/image/logo.png",func:this.freStartBack};
  let detectionTime = {name:"检测时间",src:"../static/image/logo.png",func:this.fdetectionTime};

  //one 代码巡航功能，two代表水质功能 ，three清洁功能

  let onegroup0 = [sign, deleteOne, clear, cricle,backMethod,startTask];//刚上电状态
  let onegroup1 = [startTask, stopTask, startBack];//任务进行中
  let onegroupfu11 = [];    //关机状态无功能，但是如果是空的的话会难看
  let onegroupfu10 = [];//待机状态暂时不考虑
  let onegroupfu4 = [reStartBack,endBack];
  let onegroupfu3 = [];     //任务结束，要让用户选择是否保存。
  let onegroupfu2 = [stopBack,endBack];//返航中
  let onegroupfu1 = [reStartTask,startBack,endTask];


  let twogroup0 = [sign, deleteOne, clear, cricle , detectionTime,backMethod];//刚上电状态
  let twogroup1 = [startTask, stopTask, startBack,backMethod];//任务进行中
  let twogroupfu11 = [];    //关机状态无功能，但是如果是空的的话会难看
  let twogroupfu10 = [];//待机状态暂时不考虑
  let twogroupfu4 = [reStartBack,endBack,endTask];
  let twogroupfu3 = [];     //任务结束，要让用户选择是否保存。
  let twogroupfu2 = [stopBack,endBack,endTask];//返航中
  let twogroupfu1 = [reStartTask,startBack,endTask,backMethod];
  //需要确定清理方式目前是怎么定的
  let threegroup0 = [sign,deleteOne, clear, cricle ,backMethod];//刚上电状态
  let threegroup1 = [startTask, stopTask, startBack,backMethod];//任务进行中
  let threegroupfu11 = [];    //关机状态无功能，但是如果是空的的话会难看
  let threegroupfu10 = [];//待机状态暂时不考虑
  let threegroupfu4 = [reStartBack,endBack,endTask];
  let threegroupfu3 = [];     //任务结束，要让用户选择是否保存。
  let threegroupfu2 = [stopBack,endBack,endTask];//返航中
  let threegroupfu1 = [reStartTask,startBack,endTask,backMethod];

  let times = [];
  for(let i=5;i<= 15;i++){
    times.push({
      name:i+"秒",
      value:i+"",
    })
  }
  let i=0;


  //let icons=[icon1,icon2,icon3,icon4];
  export default {
    name: "icon",
    data() {
      return {

        realStatus:this.status,
        title:'sign',
        //循环圈数
        cricleShow:false,
        cricleNum:1,//循环圈数默认为1
        cricleMax:5,
        cricleMin:1,
        cricleNumToFather:1,
        //标点
        canSign:0,//能否标点  除了撤销一个和撤销全部以外全部都要给我置成0
        signMethodSelect:false,
        signMethodList:['路径点','区域点'],
        signMethod:['路径点'],  //0路径点 1水质点 2区域点
        signMethodToFather:0,


        //是否撤销 0不能撤销，1 撤销上一个，2全部撤销
        canDelete:0,//需要在对方执行操作之后给我变回来。




      //  backMethod:1,//返航方式有三种：直线返航、原地等待和 原线返航。不同方式
        backMethodSelect:false,
        backMethodList:['原路返航','直线返航','原地等待'],
        backMethod:['原路返航'],
        backMethodToFather:'原路返航',

      //检测时间
        times:times,
        timeSelect:false,
        time :['5'],
        timeToFather:'5',


        deleteOne:false,//如何告诉对方要撤销一个点？
        deleteAll:false,//全部撤销。

      }
    },
    computed:{
      icons(){
        console.log("张涵想要的数据："+this.realStatus);
        if(this.type+""==="3")
        {
          this.type = "3";
          console.log("此时的状态"+this.type);
          switch(this.realStatus){
            case '0':
              console.log("eeeee");
              return threegroup0;
            case '-11':
              return threegroupfu11;
            case '0':
              return threegroup0;
            case '-10':
              return threegroupfu10;
            case '-4':
              return threegroupfu4;
            case '-3':
              return threegroupfu3;
            case '-2':
              return threegroupfu2;
            case '-1':
              return threegroupfu1;
            default:
              break;
          }
          if(this.realStatus>0){
            return threegroup1;
          }
        }
        else if(this.type+""==="2"){
          this.type = "2";
          console.log("此时的状态"+this.type);
          switch(this.realStatus){
            case '0':
              return twogroup0;
            case '-11':
              return twogroupfu11;
            case '0':
              return twogroup0;
            case '-10':
              return twogroupfu10;
            case '-4':
              return twogroupfu4;
            case '-3':
              return twogroupfu3;
            case '-2':
              return twogroupfu2;
            case '-1':
              return twogroupfu1;
            default:
              break;
          }
          if(this.realStatus>0){
            return twogroup1;
          }

        }else if(this.type+""==="1"){
          this.type = "1";
          console.log("此时的状态"+this.type);
          switch(this.realStatus){
            case '0':
              return onegroup0;
            case '-11':
              return onegroupfu11;
            case '0':
              return onegroup0;
            case '-10':
              return onegroupfu10;
            case '-4':
              return onegroupfu4;
            case '-3':
              return onegroupfu3;
            case '-2':
              return onegroupfu2;
            case '-1':
              return onegroupfu1;
            default:
              break;
          }
          if(this.realStatus>0){
            return onegroup1;
          }
        }
      },

    },
    methods: {
      fsign() {
        if(this.type==="3"){
          this.canSign=1;
          this.signMethodSelect = true;
        }else{
          this.canSign = 1;
          if(this.type==="2"){
            this.signMethodToFather = 1;
          }else{
            this.signMethodToFather =0;//正常的路径点
          }
          this.$store.commit('canSign',this.canSign);
          this.$store.commit('signMethod',this.signMethodToFather);
        }
      },
      fdeleteOne() {
        this.canDelete = 1+2*i;
        i++;
        this.$store.commit('canDelete',this.canDelete);
      },
      fclear() {
        this.canDelete = 2+2*i;
        i++;
        this.$store.commit('canDelete',this.canDelete);

      },
      fcricle() {
        this.canSign = 0;
        this.$store.commit('canSign',0);  //不准标点了
        if (this.$store.getters.cruiseShow || this.$store.getters.detectShow|| this.$store.getters.cleanShow) {
            console.log("关闭其它");
            this.$store.commit('cruiseShow', false);
            this.$store.commit('detectShow', false);
            this.$store.commit('cleanShow', false);
        }

        this.cricleShow=true;
      },
      fstartTask() {//
        this.canSign = 0;
        this.$store.commit('canSign',0);
      },
      fendTask() {

      },
      fstopTask() {

      },
      /**
       *
       */
      freStartTask() {

      },
      fbackmethod() {
        this.canSign = 0;
        this.$store.commit('canSign',0);  //不准标点了
        this.backMethodSelect = true;

      },
      fstartBack() {

      },
      fendBack() {

      },
      fstopBack() {

      },
      freStartBack() {

      },
      fdetectionTime() {
        this.canSign = 0;
        this.$store.commit('canSign',0);  //不准标点了

      },
      onTabbarIndex: function (title) {
        console.log(title);
        console.log('aaaaaaaaaaaaaaa');
      },
       Handler(name){
         let operation = (name+"");
         if(operation==="标点"){
          //alert(name);
          this.fsign();
         }else if(operation==="撤销"){
           this.fdeleteOne();
         }else if(operation==="清除标点"){
          this.fclear();
         }else if(operation==="循环圈数"){
           this.fcricle();
         }else if(operation==="开始任务"){
           this.fstartTask();
         }else if(operation==="结束任务"){
           this.fendTask();
         } else  if(operation==="暂停任务"){
           this.fstopTask();
         }else if(operation==="继续任务"){
           this.freStartTask();
         }else if(operation==="返航方式"){
           this.fbackmethod()
         }else if(operation==="开始返航"){
           this.fstartBack();
         } else if(operation==="结束返航"){
           this.fendBack();
         } else if(operation==="暂停返航"){
           this.fstopBack();
         } else if(operation==="继续返航"){
           this.freStartBack();
         } else if(operation==="检测时间"){
           this.fdetectionTime();
         }

       },
       SendCricleNum(){

         this.closeCricleShow();
         this.cricleNumToFather = this.cricleNum;
         //使用$emit来触发一个自定义事件，并传递参数
        /* if(this.cricleNum+""!=="1") {
          this.$emit("CricleNumChange", this.cricleNum);

         }*/
       },
       closeCricleShow(){
         //one 代码巡航功能，two代表水质功能 ，three清洁功能
         this.cricleShow=false;
         if(this.type==="1"){
           console.log("巡航");
           this.$store.commit('cruiseShow', true);
         }else if(this.type==="2"){
           console.log("水质");
           this.$store.commit('detectShow', true);
         }else if(this.type==="3") {
           console.log("清洁");
           this.$store.commit('cleanShow', true);
         }
      },
      setSignMethod(){
        this.signMethodSelect=false;
        if(this.signMethod[0]==="路径点"){
          this.signMethodToFather=3;
        }else if(this.signMethod[0]==="区域点"){
          this.signMethodToFather=2;
        }

        this.$store.commit('canSign', this.canSign);
        this.$store.commit('signMethod', this.signMethodToFather);

      },
      closesignMethodSelect(){
        this.signMethodSelect=false;
      },
      closebackMethodSelect(){
        this.backMethodSelect=false;
      },
      setBackMethod(){
        this.backMethodSelect=false;
        this.backMethodToFather = this.backMethod[0];
        console.log(this.backMethodToFather)
      },
      closeTimeSelect(){
        this.timeSelect = false;
      },
      setTimeChange(){
        this.timeToFather = this.time;
        this.timeSelect =false;
      }



    },
    props:['status','type'],
    components: {
      Grid,
      GridItem,
      TabbarItem,
      XButton,
      Popup,
      InlineXNumber,
      Selector,
      Group,
      Popover,
      Checklist,
      Picker,
    },
    directives: {
      TransferDom
    },
  }
</script>




<style lang="less">
  @import '~vux/src/styles/reset.less';

  .grid-center {
    display: block;
    text-align: center;
    color: #666;
  }
  .icon-grid .weui-grid {
    padding: 13px 10px;
  }
</style>

<style scoped>
  .popup{
    margin:30px 50px 30px 50px;
    text-align:center;
  }
</style>
