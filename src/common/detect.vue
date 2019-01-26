<template>
  <div class="detect-popup">
    <popup
      v-model="showPopup"
      v-bind:height="size"
      :is-transparent="true"
      :hide-on-blur="false"
      :show-mask="false">
      <div class="detect-show">
        <icon v-bind:status="status" v-bind:type="'2'" v-bind:id="id"  v-on:changeHeight="changeHeight"></icon>
      </div>
    </popup>
    <div v-transfer-dom>
      <alert v-model="show" :title="error[code]">{{tip[code]}}</alert>
    </div>
  </div>
</template>

<script>
  import { Popup, XButton, Grid, GridItem,Alert,TransferDom } from 'vux'
  import Icon from '../components/icon.vue'
  import store from '../store'
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
    },
    computed: {
      status(){
        return store.getters.curr_state[this.id]+"";
        //return "0";
      },
      showPopup: {
        get() {
          return store.getters.detectShow
        },
        set(value) {

          if(this.id+""==="-1"){
            this.code = 0;
            this.show = true;
          }else if(this.status+''==="-11"){//船没上电
            this.code = 1;
            this.show = true;
          }else if(this.status>0){
            if(store.getters.cruiseShow || store.getters.cleanShow){//说明是从别的地方切换过来的
              store.commit('detectShow', false);
              this.code = 2;
              this.show = true;
              console.log("就运行的这里");
            }
          }else{
            if (store.getters.cruiseShow || store.getters.cleanShow) {
              if (value) {
                store.commit('cruiseShow', false);
                store.commit('cleanShow', false);
                this.$store.commit('canSign', 0);
              }
            }
          }
        },
      }
    },
    props:['id'],
    data () {
      return {
        code:-1,
        show:false,
        size:'130px',
        error:["暂未选船","船尚未上电","船正在运行"],
        tip:["请先选择船","请先开tip船","请勿切换到别的任务"],
      };
    },
    directives: {
      TransferDom
    },
  }
</script>






<style lang="less">
  @import '~vux/src/styles/reset.less';

  .detect-popup {
    position: fixed;
  }
  .detect-show {
    width: 97%;
    background-color: #fff;
    margin: 0 auto;
  }
  .detect-show .vux-swiper{
    height: 220px !important;
    background-color: #fff;
  }
  .detect-show .weui-tabbar__item {
    float: left;
    width: 100%/3;
  }
  .detect-top .weui-tabbar__item {
    padding-top: 0.3rem;
  }
  .detect-bottom .weui-tabbar__item {
    width: 50%;
    padding-top: 0.2rem;
  }
  .detect-show .detect-button {
    line-height: 0.8rem;
    text-align: center;
  }
  .detect-button .weui-btn_mini {
    padding: 0 13%;
  }

  .detect-show .weui-grid {
    padding: 13px 10px;
  }
</style>
