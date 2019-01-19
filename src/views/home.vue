<template>
  <div class="amap">
    <div id="amap-main" ></div>
    <!--<p>这里其实根据船的数目有多个</p>-->
    <Ocmap v-bind:msg="msg" ></Ocmap>
    <div v-for="n in count">
      <div v-model="chuans[n]">
        <cruise></cruise>
        <clean></clean>
        <detect></detect>
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
        count: 2,
        present: 1,
        chuans: [true, false, false, false, false, false, false, false],

      }
    },
    computed: {
      msg(){//船的数目

          return {
            id: this.present,
            pointType: this.$store.getters.signMethod,
            canSign: this.$store.getters.canSign,
            isdel:this.$store.getters.canDelete,
          }
       },
      deletePoint(){
        return this.$store.getters.canDelete;
      }
    },
    //父子传参只能用prop
    //  prop:['count','present'],
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
