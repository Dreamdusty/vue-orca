<template>
  <div class="clean-popup">
    <popup
      v-model="showPopup"
      v-bind:height="size"
      :is-transparent="true"
      :hide-on-blur="false"
      :show-mask="false">
      <div class="clean-show">
        <icon v-bind:status="status" v-bind:type="'3'" v-bind:id="this.id"  v-on:changeHeight="changeHeight"></icon>
      </div>
    </popup>
    <div v-transfer-dom>
      <alert v-model="show" :title="error[code]">{{tip[code]}}</alert>
    </div>
  </div>
</template>

<script>
  import { Popup, XButton, Grid, GridItem ,Alert,TransferDom} from 'vux'
  import Icon from '../components/icon.vue'
  import store from '../store'
  import variable from '../utils/global/variable'
  import {getCookie, changeState} from "../utils/cookie";

  export default {
    name: "detect",
    components: {
      Popup,
      XButton,
      Grid,
      GridItem,
      Icon,
      Alert
    },
    methods: {
      onTabbarIndex() {
        console.log('点击');
      },
      changeHeight(data){
        this.size = data+"px";
      }
/*      sign(data){
        this.$emit('sign',data);
      }*/
    },
    computed: {
      status:function(){
       return store.getters.curr_state[this.id]+"";
        //return "1";
      },
      status1:function(){
        return store.getters.curr_state;
      },
      showPopup: {
        get() {
          return store.getters.cleanShow
        },
        set(value) {
          if(this.id+""==="-1"){
            this.code = 0;
            this.show = true;
          }else if(this.status+''==="-11"){//船没上电
            this.code = 1;
            this.show = true;
          }else if(this.status>0){
            if(store.getters.cruiseShow||store.getters.detectShow){//说明是从别的地方切换过来的
              store.commit('cleanShow', false);
              this.code = 2;
              this.show = true;
              console.log("就运行的这里");
            }
          }else{
            if (store.getters.cruiseShow || store.getters.detectShow) {
              if (value) {
                store.commit('cruiseShow', false);
                store.commit('detectShow', false);
                this.$store.commit('canSign', 0);
                //检测切换事件
              }
            }
          }



        },
      }
    },

    data () {
      return {
        code:-1,
        size:'130px',
        show:false,
        error:["暂未选船","船尚未上电","船正在运行"],
        tip:["请先选择船","请先开tip船","请勿切换到别的任务"],
        data:store.getters.curr_state,
      };

    },
   /* watch:{
      status(newval,)
    }.*/
    props:['id'],
    directives: {
      TransferDom
    },
  }
</script>



<style lang="less">
  @import '~vux/src/styles/reset.less';

  .clean-popup {
    position: fixed;
  }
  .clean-show {
    width: 97%;
    background-color: #fff;
    margin: 0 auto;
  }
  .clean-tab .vux-swiper{
    height: 220px !important;
    background-color: #fff;
  }
  .clean-tab .weui-tabbar__item {
    float: left;
    width: 100%/3;
  }
  .clean-top .weui-tabbar__item {
    padding-top: 0.3rem;
  }
  .clean-bottom .weui-tabbar__item {
    padding-top: 0.2rem;
  }
  .clean-bottom-two .weui-tabbar__item {
    width: 50%;
    padding-top: 0.2rem;
  }
  .clean-tab .clean-button {
    line-height: 0.8rem;
    text-align: center;
  }
  .clean-button .weui-btn_mini {
    padding: 0 13%;
  }

  .weui-grid {
    padding: 13px 10px;
  }
</style>
