<template>
  <div class="cruise-popup">
    <popup
      v-model="showPopup"
      height="217px"
      :is-transparent="true"
      :hide-on-blur="false"
      :show-mask="false">
      <div class="cruise-show">
        <div class="cruise-top">
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
            <span slot="label">循环圈数</span>
          </tabbar-item>
          <tabbar-item @on-item-click="onTabbarIndex">
            <img slot="icon" src="../assets/logo.png" alt="">
            <span slot="label">全部删除</span>
          </tabbar-item>
        </div>
        <div class="cruise-button">
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
    name: "cruise",
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
          return this.$store.getters.cruiseShow
        },
        set(value) {
          if (this.$store.getters.cleanShow || this.$store.getters.detectShow) {
            this.$store.commit('cleanShow', false);
            this.$store.commit('detectShow', false);
          }
          if (value) {
            this.$store.commit('cruiseShow', value)
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
</style>
