<template>
  <div>
    <div v-for="icon in icons">
      <tabbar-item @on-item-click="controlFunction('aaaa')">
        <img slot="icon" v-bind:src="icon.src" alt="">
        <span slot="label">{{icon.name}}</span>
      </tabbar-item>
    </div>
  </div>

</template>

<script>
  import { TabbarItem } from 'vux'
  // let 可以改变值， const 不可改变值
  const sign= {
    name:'标点',
    src:'../static/image/logo.png',
    func: this.fsign
  };
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
  let reStartBack = {name:"继续返航",src:".../static/image/logo.png",func:this.freStartTask};
  let detectionTime = {name:"检测时间",src:"../static/image/logo.png",func:this.fdetectionTime};

  //one 代码巡航功能，two代表水质功能 ，three清洁功能
  let onegroup0 = [sign, deleteOne, clear, cricle];//刚上电状态
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
  let threegroup0 = [sign, deleteOne, clear, cricle ,backMethod];//刚上电状态
  let threegroup1 = [startTask, stopTask, startBack,backMethod];//任务进行中
  let threegroupfu11 = [];    //关机状态无功能，但是如果是空的的话会难看
  let threegroupfu10 = [];//待机状态暂时不考虑
  let threegroupfu4 = [reStartBack,endBack,endTask];
  let threegroupfu3 = [];     //任务结束，要让用户选择是否保存。
  let threegroupfu2 = [stopBack,endBack,endTask];//返航中
  let threegroupfu1 = [reStartTask,startBack,endTask,backMethod];



  //let icons=[icon1,icon2,icon3,icon4];
  export default {
    name: "icon",
    data() {
      return {
        realStatus:this.status,
        title:'sign'
      }
    },
    computed:{
      icons(){
        console.log("张涵想要的数据："+this.realStatus);
        if(this.type+""==="3")
        {
          switch(this.realStatus){
            case '0':
              return onegroup0;
            case '2':
              return [icon2,icon4];
          }
        }

      }
    },
    methods:{
      controlFunction (name){
        alert("ok");
        console.log("qqqq");
        if(name==="sign"){
          console.log("mmm");
        }
      },
      fsign(){
        console.log("zzzzzzzzzzzz");
        alert("1111111111111111111");
      },
      fdeleteOne(){

      },
      fclear(){

      },
      fcricle(){

      },
      fstartTask(){

      },
      fendTask(){

      },
      fstopTask(){

      },
      /**
       *
       */
      freStartTask(){

      },
      fbackmethod(){

      },
      fstartBack(){

      },
      fendBack(){

      },
      fstopBack(){

      },
      freStartBack(){

      },
      fdetectionTime(){

      },
      onTabbarIndex:function(title){
        console.log(title);
        console.log('aaaaaaaaaaaaaaa');
      }
    },
    props:['status','type'],
    components: {
      TabbarItem
    }
  }
</script>

<style scoped>

</style>
