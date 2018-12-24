<template>
  <div class="clean-popup">
    <popup
      v-model="showPopup"
      height="323px"
      :is-transparent="true"
      :hide-on-blur="false"
      :show-mask="false">
      <div class="clean-show">
        <tab :line-width=1 active-color='#1e445c' v-model="index">
          <tab-item @on-item-click="onClickClean(item)" class="vux-center" :selected="clean === item" v-for="(item, index) in list" @click="clean = item" :key="index">{{item}}</tab-item>
        </tab>
        <div class="clean-tab">
          <swiper v-model="index" height="100px" :show-dots="false">
            <swiper-item v-for="(item, index) in list" :key="index">
              <div v-if="item === list[0]">
                <div class="clean-top">
                  <tabbar-item @on-item-click="onTabbarIndex">
                    <img slot="icon" src="../../static/image/logo.png" alt="">
                    <span slot="label">标点</span>
                  </tabbar-item>
                  <tabbar-item @on-item-click="onTabbarIndex">
                    <img slot="icon" src="../../static/image/logo.png" alt="">
                    <span slot="label">撤销</span>
                  </tabbar-item>
                  <tabbar-item @on-item-click="onTabbarIndex">
                    <img slot="icon" src="../../static/image/logo.png" alt="">
                    <span slot="label">循环圈数</span>
                  </tabbar-item>
                </div>
                <div class="clean-bottom">
                  <tabbar-item @on-item-click="onTabbarIndex">
                    <img slot="icon" src="../../static/image/logo.png" alt="">
                    <span slot="label">清洁方式</span>
                  </tabbar-item>
                  <tabbar-item @on-item-click="onTabbarIndex">
                    <img slot="icon" src="../../static/image/logo.png" alt="">
                    <span slot="label">返航方式</span>
                  </tabbar-item>
                  <tabbar-item @on-item-click="onTabbarIndex">
                    <img slot="icon" src="../../static/image/logo.png" alt="">
                    <span slot="label">预约</span>
                  </tabbar-item>
                </div>
                <div class="clean-button">
                  <x-button mini>开始任务</x-button>
                  <x-button mini type="primary">保存任务</x-button>
                </div>
              </div>
              <div v-if="item === list[1]">
                <div class="clean-top">
                  <tabbar-item @on-item-click="onTabbarIndex">
                    <img slot="icon" src="../../static/image/logo.png" alt="">
                    <span slot="label">标点</span>
                  </tabbar-item>
                  <tabbar-item @on-item-click="onTabbarIndex">
                    <img slot="icon" src="../../static/image/logo.png" alt="">
                    <span slot="label">撤销</span>
                  </tabbar-item>
                  <tabbar-item @on-item-click="onTabbarIndex">
                    <img slot="icon" src="../../static/image/logo.png" alt="">
                    <span slot="label">循环次数</span>
                  </tabbar-item>
                </div>
                <div class="clean-bottom-two">
                  <tabbar-item @on-item-click="onTabbarIndex">
                    <img slot="icon" src="../../static/image/logo.png" alt="">
                    <span slot="label">返航方式</span>
                  </tabbar-item>
                  <tabbar-item @on-item-click="onTabbarIndex">
                    <img slot="icon" src="../../static/image/logo.png" alt="">
                    <span slot="label">预约</span>
                  </tabbar-item>
                </div>
                <div class="clean-button">
                  <x-button mini>开始任务</x-button>
                  <x-button mini type="primary">保存任务</x-button>
                </div>
              </div>
            </swiper-item>
          </swiper>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
  import { Popup, Tab, TabItem, TabbarItem, Swiper, SwiperItem, XButton } from 'vux'
  export default {
    name: "clean",
    components: {
      Popup,
      TabbarItem,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      XButton,
    },
    methods: {
      onClickClean(item) {
        if (item === '区域清洁') {
          console.log('区域清洁');
        } else {
          console.log('延边清洁');
        }
      },
      onTabbarIndex() {
        console.log('点击');
      },
    },
    computed: {
      showPopup: {
        get() {
          return this.$store.getters.cleanShow
        },
        set(value) {
          if (this.$store.getters.cruiseShow || this.$store.getters.detectShow) {
            if (value) {
              this.$store.commit('cruiseShow', false);
              this.$store.commit('detectShow', false);
            }
          }
        },
      }
    },
    data () {
      return {
        list: ['区域清洁', '延边清洁'],
        index: 0,
        clean: '区域清洁',
      }
    },
  }
</script>

<style lang="less">
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
</style>
