<template>
  <div class="cruise-popup">
    <popup
      v-model="showPopup"
      height="217px"
      :is-transparent="true"
      :hide-on-blur="false"
      :show-mask="false">
      <div class="cruise-show">
        <icon v-bind:status="status" v-bind:type="'1'"></icon>
      </div>
    </popup>
  </div>
</template>

<script>
  import { Popup, XButton, Grid, GridItem } from 'vux'
  import Icon from '../components/icon.vue'
  export default {
    name: "detect",
    components: {
      Popup,
      XButton,
      Grid,
      GridItem,
      Icon,
    },
    methods: {
      onTabbarIndex() {
        console.log('点击');
      },
    },
    computed: {
      status(){
        return "0";
      },
      showPopup: {
        get() {
          return this.$store.getters.cruiseShow
        },
        set(value) {
          if (this.$store.getters.detectShow || this.$store.getters.cleanShow) {
            if (value) {
              this.$store.commit('detectShow', false);
              this.$store.commit('cleanShow', false);
            }
          }
        },
      }
    },
    data () {
      return {

      };
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
