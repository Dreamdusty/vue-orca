<template>
  <div class="amap">
    <div id="amap-main" ></div>
    <!--<p>这里其实根据船的数目有多个</p>-->
    <Ocmap v-bind:msg="msg" ></Ocmap>
    <div v-for="n in count">
      <div v-model="chuans[n]">
        <cruise v-bind:id="n"></cruise>
        <clean v-bind:id="n"></clean>
        <detect v-bind:id="n"></detect>
      </div>
    </div>
  </div>
</template>

<script>
  import Cruise from "../common/cruise"
  import Clean from '../common/clean'
  import Detect from '../common/detect'
  import Ocmap from '../common/Ocmap'

  import { selectBound } from "../api/api";
  import { getCookie } from "../utils/cookie";
  import { rayCasting, rayBarrier } from "../utils/route/routeMapLoading";
  import variable from "../utils/global/variable"
//fzp123  123456
  let map;
  let marker;
  let amap;
  export default {
    name: "home",
    data() {
      return {
        // getCookie("totalShip")
        count:2,
        present:1,  //this.$store.getters.shipChooseId,
       /* chuans: [
          true, false, false, false, false, false, false, false],
*/
      }
    },
    computed: {
      msg(){//船的数目
          return {
            id: this.present,
            pointType: this.$store.getters.signMethod,
            canSign: this.$store.getters.canSign,
            isdel:this.$store.getters.canDelete,
            ship: [[108.89662,34.247559], [108.898846, 34.247005]],//所有船坐标
            shipRoad: [],//所有船走的所有路径点
            shipAngle: [90,30],//所有船角度
            shipChooseId: 0,//当前选中船的ID
            CurrentTaskId: -1,//当前所选船的任务id -1表示当没有任务 0巡航任务 1 水质任务 2区域任务
            CurrentTaskPath:[],//当前任务路径点
            startTask: this.$store.getters.startTask,
          }
       },
      chuans(){
        let temp =[];
        let object = false;
        for(let i=0;i<this.count;i++){
          object = false;
          if(i===this.present) {
            object = true;
          }
          temp.push(object);

        }
        console.log(temp);
        return temp;
      },


    },
    watch: {
      present: function (data) {//观察到当前船变化就改变当前船
        let temp = this.chuans;
        this.chuans.forEach(function (val, index, temp) {
          if (index < this.count) {
            temp[index] = false;
          }
        });
        temp[data - 1] = true;
        this.chuans = temp;
      },
    },
    methods: {

      mounted() {

      },

    },
    components: {
      Cruise,
      Clean,
      Detect,
      Ocmap,
    },
  }
</script>

<style>
  #amap-main {
    height: 5.42rem;
  }
  /* 覆盖高德logo样式 */
  .amap .amap-logo {
    right: -10000px !important;
    left: auto !important;
    display: none;
  }
  .amap .amap-copyright {
    bottom: -10000px;
    display: none;
  }
</style>
