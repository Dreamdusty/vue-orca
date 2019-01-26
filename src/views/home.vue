<template>
  <div class="amap">
    <!--<p>这里其实根据船的数目有多个</p>-->
    <Ocmap></Ocmap>
    <div v-for="ship in chuans">
      <div v-if="ship.value">
        <cruise v-bind:id="ship.id"></cruise>
        <clean v-bind:id="ship.id"></clean>
        <detect v-bind:id="ship.id"></detect>
      </div>
    </div>
    <div v-if="show">
      <cruise v-bind:id="-1"></cruise>
      <clean v-bind:id="-1"></clean>
      <detect v-bind:id="-1"></detect>
    </div>
<!--    <p>当任务结束的时候弹出询问框，暂时先不管是否再来一圈？？</p>-->
  </div>
</template>

<script>
  import Cruise from "../common/cruise"
  import Clean from '../common/clean'
  import Detect from '../common/detect'
  import Ocmap from '../common/Ocmap'
  import store from '../store'

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
        count:4,
        present:store.getters.shipChooseId,

      }
    },
    computed: {
      show(){
        return store.getters.shipChooseId===-1;//用于未上电状态的提醒。
      },
      chuans(){
        let temp =[];
        let object;
        for(let i=0;i<this.count;i++){
          object ={id:i,value:false};
          if(i===store.getters.shipChooseId) {
            object = {id:i,value:true};
          }
          temp.push(object);
        }
        console.log(temp);
        return temp;
      },


    },
    methods: {

      onCancel () {
        console.log('on cancel')
      },
      onConfirm (msg) {//确定再来一圈？
        console.log('on confirm')
        if (msg) {
          alert(msg);
        }
        //  this.present = this.temp.value;  //把刚才临时保存的值给当前的值
        store.commit('shipChooseId',this.temp.value);
        this.headerTop = this.temp.name;
        // 确定要切换船，就要切换

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
