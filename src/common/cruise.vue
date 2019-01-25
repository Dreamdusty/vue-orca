<template>
  <div class="cruise-popup">
    <popup
      v-model="showPopup"
      v-bind:height="size"
      :is-transparent="true"
      :hide-on-blur="false"
      :show-mask="false">
      <div class="cruise-show">
        <icon v-bind:status="status" v-bind:type="'1'" v-bind:id="id"  v-on:changeHeight="changeHeight"></icon>
      </div>
    </popup>

    <div v-transfer-dom>
      <alert v-model="show" :title="error[code]" @on-show="on_show" @on-hide = "on_hide">{{tip[code]}}</alert>
    </div>
  </div>
</template>

<script>
  import { Popup, XButton, Grid, GridItem,TransferDom,Alert} from 'vux'
  import Icon from '../components/icon.vue'
  export default {
    name: "detect",
    components: {
      Popup,
      XButton,
      Grid,
      GridItem,
      Icon,
      Alert,
    },
    methods: {
      onTabbarIndex() {
        console.log('点击');
      },
      on_show(){
        console.log("显示");
      },
      on_hide(){
        console.log("隐藏");
      },
      changeHeight(data){
        this.size = data+"px";
      }
    },
    computed: {
      status(){
        return this.$store.getters.curr_state[this.id]+"";
       // return "0";
      },

      showPopup: {
        get() {
          return this.$store.getters.cruiseShow
        },
        set(value) {

          if(this.id+""==="-1"){
            this.code = 0;
            this.show = true;
          }else if(this.status+''==="-11"){//船没上电
            this.code = 1;
            this.show = true;
          }else if(this.status>0){
            if(this.$store.getters.detectShow || this.$store.getters.cleanShow){//说明是从别的地方切换过来的
              this.$store.commit('cruiseShow', false);
              this.code = 2;
              this.show = true;
              console.log("就运行的这里");
            }
          }else{
            if (this.$store.getters.detectShow || this.$store.getters.cleanShow) {
              if (value) {
                this.$store.commit('detectShow', false);
                this.$store.commit('cleanShow', false);
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

  .cruise-popup {
    position: fixed;
  }
  .cruise-show {
    width: 97%;
    background-color: #fff;
    margin: 0 auto;
  }
  .cruise-show .vux-swiper{
    height: 220px !important;
    background-color: #fff;
  }
  .cruise-show .weui-tabbar__item {
    float: left;
    width: 100%/4;
  }
  .cruise-top .weui-tabbar__item {
    padding-top: 0.3rem;
  }
  .cruise-show .cruise-button {
    line-height: 0.8rem;
    text-align: center;
  }
  .cruise-button .weui-btn_mini {
    padding: 0 13%;
  }

  .cruise-top .weui-grid {
    padding: 13px 10px;
  }
</style>
