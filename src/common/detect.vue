<template>
  <div class="detect-popup">
    <popup
      v-model="showPopup"
      height="285px"
      :is-transparent="true"
      :hide-on-blur="false"
      :show-mask="false">
      <div class="detect-show">
        <div class="detect-top">
          <tabbar-item @on-item-click="onTabbarIndex">
            <img slot="icon" src="../assets/logo.png" alt="">
            <span slot="label">标点</span>
          </tabbar-item>
          <tabbar-item @on-item-click="onTabbarIndex">
            <img slot="icon" src="../assets/logo.png" alt="">
            <span slot="label">撤销</span>
          </tabbar-item>
          <tabbar-item @on-item-click="onTabbarIndex">
            <img slot="icon" src="../assets/logo.png" alt="">
            <span slot="label">采样容量</span>
          </tabbar-item>
        </div>
        <div class="detect-bottom">
          <tabbar-item @on-item-click="onTabbarIndex">
            <img slot="icon" src="../assets/logo.png" alt="">
            <span slot="label">检测时间</span>
          </tabbar-item>
          <tabbar-item @on-item-click="onTabbarIndex">
            <img slot="icon" src="../assets/logo.png" alt="">
            <span slot="label">返航方式</span>
          </tabbar-item>
        </div>
        <div class="detect-button">
          <x-button mini>开始任务</x-button>
          <x-button mini type="primary">保存任务</x-button>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
  import { Popup, TabbarItem, XButton } from 'vux'
  export default {
    name: "detect",
    components: {
      Popup,
      TabbarItem,
      XButton,
    },
    methods: {
      onTabbarIndex() {
        console.log('点击');
      },
    },
    computed: {
      showPopup: {
        get() {
          return this.$store.getters.detectShow
        },
        set(value) {
          if (this.$store.getters.cruiseShow || this.$store.getters.cleanShow) {
            this.$store.commit('cruiseShow', false);
            this.$store.commit('cleanShow', false);
          }
          if (value) {
            this.$store.commit('detectShow', value)
          }
        },
      }
    },
    data () {
      return {
      }
    },
  }
</script>

<style lang="less">
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
</style>
