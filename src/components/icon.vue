<template>
  <div>
    <div class="icon-grid">
      <grid :show-lr-borders="false" :cols="4" >
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
    <div v-transfer-dom>
      <popup v-model="timeSelect" position="bottom" height="50%"  @on-hide="closeTimeSelect"
             :is-transparent="false"
             :show-mask="false">
        <div class="popup">

          <group-title>请选择检测时间，系统默认值为5秒</group-title>
          <picker :data='timelist' v-model='time'></picker>
          <x-button type="primary" @click.native="setTimeChange" style="width:100px;margin-top:30px" >确定</x-button>
        </div>
      </popup>
    </div>

    <div v-transfer-dom>
      <popup v-model="cleanShow" position="bottom" height="50%"  @on-hide="closeCleanShow"
             :is-transparent="false"
             :show-mask="false"
             :hide-on-blur="true">
        <div class="popup">
          <checklist :title="'请选择返航方式,系统默认为 标准'" :options="cleanlist" v-model="cleanItem" :max="1"></checklist>
          <x-button type="primary" @click.native="setCleanChange" style="width:100px;margin-top:30px" >确定</x-button>
        </div>
      </popup>
    </div>

    <div v-transfer-dom>
      <alert v-model="showError" :title="errorTitle[errorCode]">{{errorTip[errorCode]}}</alert>
    </div>

    <toast v-model="showToast" text="任务正在开启中"></toast>
    <toast v-model="startError" text="出现错误"></toast>
    <toast v-model="showSuccessful" text="设置成功"></toast>





  </div>

</template>

<script>
  import { TabbarItem,TransferDom,Popup,InlineXNumber,XButton,Grid,GridItem,Selector,Group,Popover,Checklist,Picker,GroupTitle,Alert,Toast} from 'vux'
  import {sendAreaPoint,start,end,recover,stop,back,getReceive,setReceive,getClean,setClean} from "../utils/socket";
  import { addRoute } from "../api/api";
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
  let saveRoute = {name:"保存路线",src:"../static/image/logo.png"};//
  let cleanliness = {name:"清洁程度",src:"../static/image/logo.png"};//清洁程度
  //让保存路线在开始任务之后，

  //one 代码巡航功能，two代表水质功能 ，three清洁功能

  let onegroup0 = [sign, deleteOne, clear, cricle,backMethod,startTask];//刚上电状态
  let onegroup1 = [stopTask,endTask, backMethod,startBack];//任务进行中
  let onegroupfu11 = [];    //关机状态无功能，但是如果是空的的话会难看
  let onegroupfu10 = [];//待机状态暂时不考虑
  let onegroupfu4 = [reStartBack,endBack];
  let onegroupfu3 = [];     //任务结束，要让用户选择是否保存。
  let onegroupfu2 = [stopBack,endBack];//返航中
  let onegroupfu1 = [reStartTask,startBack,endTask];


  let twogroup0 = [sign, deleteOne, clear, detectionTime,backMethod,startTask];//刚上电状态
  let twogroup1 = [ stopTask,endTask, backMethod,startBack];//任务进行中
  let twogroupfu11 = [];    //关机状态无功能，但是如果是空的的话会难看
  let twogroupfu10 = [];//待机状态暂时不考虑
  let twogroupfu4 = [reStartBack,endBack,endTask]; //任务结束
  let twogroupfu3 = [];     //任务结束，要让用户选择是否保存。     //没有
  let twogroupfu2 = [stopBack,endBack,endTask];//返航中       //任务暂停
  let twogroupfu1 = [reStartTask,startBack,endTask,backMethod];    //没有
  //需要确定清理方式目前是怎么定的
  let threegroup0 = [sign,deleteOne, clear,backMethod,startTask,cleanliness,saveRoute];//刚上电状态,backMethod
  let threegroup1 = [stopTask,endTask,  backMethod,startBack];//任务进行中
  let threegroupfu11 = [];    //关机状态无功能，但是如果是空的的话会难看
  let threegroupfu10 = [];    //待机状态暂时不考虑
  let threegroupfu4 = [reStartBack,endBack,endTask];
  let threegroupfu3 = [];     //任务结束，要让用户选择是否保存。
  let threegroupfu2 = [stopBack,endBack];//返航中
  let threegroupfu1 = [reStartTask,startBack,endTask,backMethod];


  //-5是返航

  let times = [[{name:'5秒',value:5},{name:'6秒',value:6},{name:'7秒',value:7},
    {name:'8秒',value:8},{name:'9秒',value:9},{name:'10秒',value:10},
    {name:'11秒',value:11},{name:'12秒',value:12},{name:'13秒',value:13},
    {name:'14秒',value:14},{name:'15秒',value:15}]];

  let i=0;

  export default {
    name: "icon",
    data() {
      return {
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
        signMethodToFather:-1,


        //是否撤销 0不能撤销，1 撤销上一个，2全部撤销
        canDelete:0,//需要在对方执行操作之后给我变回来。




      //  backMethod:1,//返航方式有三种：直线返航、原地等待和 原线返航。不同方式
        backMethodSelect:false,
        backMethodList:['原路返航','直线返航','原地等待'],
        backMethod:['原路返航'],
        backMethodToFather:'原路返航',

      //检测时间
        timelist:times,
        timeSelect:false,
        time :[5],
        timeToFather:5,
        //清洁程度
        cleanShow:false,
        cleanlist:["快速","标准","极净"],
        cleanItem:['标准'],
        cleanTofather:5,



        deleteOne:false,//如何告诉对方要撤销一个点？
        deleteAll:false,//全部撤销。

        startTask:0,

        saveRoute:0,

        height:130,   //高度用来做自适应，让外面知道应该给多高的popup

        showToast:false,
        showSuccessful:false,
        startError:false,
       // toastCode:-1,
       // toastTip:["任务开启","设置成功"],
        showError:false,
        errorCode:-1,
        errorTitle:["未标路径点","区域未闭合"],
        errorTip:["请标路径点","请点击第一个点使得区域闭合"],

      }
    },
    computed:{
      area(){
        return this.$store.getters.area;

      },
      route(){
        return this.$store.getters.root;
      },
     // saveRoute(){
     //   return this.$store.getters.saveRoute;
    //  },
      icons(){
      //  console.log("张涵想要的数据："+this.status);
        if(this.type+""==="3")
        {
          this.type = "3";
          console.log("此时的类型"+this.type);

          switch(this.status){
            case '0':
              console.log("eeeee");
              this.height = 210;
              return threegroup0;
            case '-11':
              return threegroupfu11;
            case '1':
              return threegroup1;
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
          if(this.status>0){
            return twogroup1;
          }
        }
        else if(this.type+""==="2"){
          this.type = "2";
        //  console.log("此时的状态"+this.type);
          switch(this.status){
            case '0':
              this.height = 210;
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
          if(this.status>0){
            return twogroup1;
          }

        }else if(this.type+""==="1"){
          this.type = "1";
         // console.log("此时的状态"+this.type);
          switch(this.status){
            case '0':
              this.height = 210;
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
          if(this.status>0){
            return onegroup1;
          }
        }
        if(this.status+""!=="0"){
          this.height = 130;
        }



      },

    },
    methods: {
      fsign() {
        if(this.type==="3"){
          this.canSign = 1;
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
          //使得标点的时候弹框下去
          // if(this.$store.getters.detectShow){
          //   this.$store.commit('detectShow', false);
          // }else if(this.$store.getters.cleanShow) {
          //   this.$store.commit('cleanShow', false);
          // }else if(this.$store.getters.cruiseShow){
          //   this.$store.commit('cruiseShow', false);
          // }

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
            //console.log("关闭其它");
            this.$store.commit('cruiseShow', false);
            this.$store.commit('detectShow', false);
            this.$store.commit('cleanShow', false);
        }

        this.cricleShow=true;
      },
      fstartTask() {
        this.canSign = 0;
        this.$store.commit('canSign',0);  //不准标点了
        this.startTask =(this.startTask +1)%10;
        let temp =[parseInt(this.type),this.startTask];
        this.$store.commit("startTask",temp);
      /* var name = this.$store.getters.curr_state;
        name.splice(1,1,1);
      // name[1] = 0;
       this.$store.commit('curr_state',name);*/
      },
      fendTask() {
        end();
      },
      fstopTask() {
        stop();
      },
      freStartTask() {
        recover();
      },
      fbackmethod() {
        this.canSign = 0;
        this.$store.commit('canSign',0);  //不准标点了
        this.backMethodSelect = true;

      },
      fstartBack() {
        back();
      },
      fendBack() {
        end();
      },
      fstopBack() {
        stop();
      },
      freStartBack() {
        recover();
      },
      fdetectionTime() {
        this.timeSelect = true;
        this.canSign = 0;
        this.$store.commit('canSign',0);  //不准标点了

      },
      fsaveRoute(){
        //this.canSign = 0;
       // this.$store.commit('canSign',0);  //不准标点了
        console.log("save");
        this.saveRoute =(this.saveRoute +1)%10;
        let temp =[parseInt(this.type),this.saveRoute];
        this.$store.commit("saveRoute",temp);
      },
      fcleanliness(){
        this.cleanShow = true;
      },
      onTabbarIndex: function (title) {
     //   console.log(title);
    //    console.log('aaaaaaaaaaaaaaa');
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
         } else if(operation==='保存路线'){
           this.fsaveRoute();
         }else if(operation==='清洁程度'){
           this.fcleanliness();
         }


       },
       SendCricleNum(){

         this.closeCricleShow();
         this.cricleNumToFather = this.cricleNum;
         this.showSuccessful = true;

       },
       closeCricleShow(){
         //one 代码巡航功能，two代表水质功能 ，three清洁功能
         this.cricleShow=false;
         if(this.type==="1"){
           //console.log("巡航");
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
        this.$store.commit('canSign',this.canSign);
        this.$store.commit('signMethod', this.signMethodToFather);
        //this.showSuccessful = true;

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
        console.log(this.backMethodToFather);
        this.showSuccessful = true;
      },
      closeTimeSelect(){
        this.timeSelect = false;
      },
      setTimeChange() {
        this.timeToFather = this.time;
        this.timeSelect = false;
        this.showSuccessful = true;
      },

      closeCleanShow(){
        this.cleanShow= false;
      },
      setCleanChange(){
        if(this.cleanItem[0]==="快速"){
          this.cleanTofather  = 7;
        }else if(this.cleanItem[0]==="极净"){
          this.cleanTofather = 3;
        }
        this.closeCleanShow();
        this.showSuccessful = true;
      //  console.log("清洁时间"+this.cleanTofather);
      },


      handleRoute(route){
        let fanRoute ="";
        let resultRoute = "";
        let split = route.split(";");
        for(var i=split.length-2;i>0;i--){//减掉两个东西  1->2->3->4->3->2  偶数的时候还要存一下第一个点  ，奇数的时候没啥说的
          fanRoute +=split[i]+";";
        }
        for(var i=0;i<this.cricleNumToFather;i++){
          if(i%2===0){
            resultRoute +=route;
          }else{
            resultRoute +=fanRoute;
          }
        }
        if(this.cricleNumToFather%2===0){
          resultRoute+=split[0]+";";
        }
        resultRoute = resultRoute.substring(0, resultRoute.length - 1);
        console.log(resultRoute);
        return resultRoute;
      }
    },
    props:['status','type','id'],
    watch:{
      status:function(val) {
      console.log("prop变化了没有"+val);
      },
      height:function(newval){
        this.$emit('changeHeight',newval);
      },
      area(newval,oldval){
        if(this.$store.getters.shipChooseId+""===(this.id+"")){
          if(this.type==='3'){//清洁功能
            //console.log('清洁功能.............................'+this.type+"...."+this.id);

            //console.log("///////////////"+this.route);
            if(this.route+""===""){
              this.showError=true;
              this.errorCode=0;
              console.log("路径不允许为空");
            }else if(newval===""){//说明当区域不闭合的时候，这个里面为[]
              this.showError=true;
              this.errorCode=1;
              console.log("区域不闭合");
            }else{
              sendAreaPoint(this.id,newval,this.cleanTofather);//将区域点进行处理，得到realroute。
              let areatemp;
             /* while(getReceive(this.id)===""||getReceive(this.id)===undefined){//等到这个东西不为空
                console.log("陷在循环里面"+getReceive(this.id));
              }*/
              areatemp = getReceive(this.id);
             // console.log("从庞长松那里拿到的数据"+areatemp);
              console.log("距离"+getClean(this.id));
             // let splitRoute = this.route.split(";");
             // let splitareaTemp = this
             // let start = split.length-2;
              let object ={ship_id:3,route:this.route+newval,turns:this.cricleNumToFather,cleanliness:this.cleanliness,real_route:this.route+areatemp};
              addRoute(object).then(res => {
                console.log("res:====" + res.data.data);
                if (res.data.code !== 200) {
                  // this.$toast(res.data.message);
                  this.startError=true;
                  console.log("错误" + res.data.message);
                } else {//正确
                 let  id = res.data.data;
                  console.log("id:" + res.data.data);
                  start(id);//给船发指令
                  this.showToast =true;//弹出提示框
                }
              });
              this.$store.commit('root',"");
              setReceive(this.id,"");
              setClean(this.id,0);

            }

          }
        }

        //console.log('haaaaaa'+newval);

      },
      type(newval,oldval){
        console.log("谁伤害了我的type：新值"+newval+",旧制"+oldval);
      },
      route(newval,oldval){
       // console.log("我就看看这个类型到底是多少"+this.type);
        //就是说还要判断如何
       if (this.$store.getters.shipChooseId+""===(this.id+"")&&newval!==""&&this.$store.getters.cleanShow!==true){
         if(this.type!=='3'){//当这个变量变化的时候还需要判断是不是这艘船在发生变化，
          // console.log("///////////////////////////////////"+this.type+"////"+this.id);
           let route = this.handleRoute(newval);//真实的路径let
           let object;
           let id;
           //看看圈数的初始值
           if(this.$store.getters.detectShow===true&&this.type==='2'){
             //console.log("执行水质");
             object = {ship_id:3,route:newval,turns:this.cricleNumToFather,water_time:this.timeToFather,real_route:route};
             addRoute(object).then(res =>{
               console.log("res:====" + res.data.data);
               if (res.data.code !== 200) {
                 // this.$toast(res.data.message);
                 this.startError=true;
                 console.log("错误"+res.data.message);
               }else{//正确
                 id = res.data.data;
                 console.log("id:"+ res.data.data);
                 start(id);//给船发指令
                 this.showToast =true;

               }
             });
             this.$store.commit('root',"");//将路径点置空
           }else if(this.$store.getters.cruiseShow===true&&this.type==='1'){//说明是巡航点
             //console.log("执行巡航");
             object = {ship_id:3,route:newval,turns:this.cricleNumToFather,real_route:route};
             addRoute(object).then(res => {
               console.log("res:====" + res.data.data);
               if (res.data.code !== 200) {
                 // this.$toast(res.data.message);
                 this.startError=true;
                 console.log("错误" + res.data.message);
               } else {//正确
                 id = res.data.data;
                 console.log("id:" + res.data.data);
                 this.showToast =true;
                 start(id);//给船发指令

               }
             });
            // this.$store.commit('root',"");//将路径点置空
           }
           this.$store.commit('root',"");//将路径点置空
          // console.log("这里执行了两次");


         }
       }

      },


    },
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
      GroupTitle,
      Alert,
      Toast,
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
