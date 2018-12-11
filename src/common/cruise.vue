<template>
  <div class="popup">
    <popup
      v-model="showPopup"
      height="350px"
      :is-transparent="true"
      :hide-on-blur="false"
      :show-mask="false">
      <div class="show">
        <!--<group class="group">-->
        <tab :line-width=1 active-color='#1e445c' v-model="index">
          <tab-item @on-item-click="onClickClean(item)" class="vux-center" :selected="clean === item" v-for="(item, index) in list" @click="clean = item" :key="index">{{item}}</tab-item>
        </tab>
        <div class="tab-swiper">
          <swiper v-model="index" height="100px" :show-dots="false">
            <swiper-item v-for="(item, index) in list" :key="index">
              <div v-if="item === list[0]">
                <tabbar-item link="/common/clean">
                  <img slot="icon" src="../assets/logo.png" alt="">
                  <span slot="label">Wechat</span>
                </tabbar-item>
                <tabbar-item show-dot link="/common/detect">
                  <img slot="icon" src="../assets/logo.png" alt="">
                  <span slot="label">Message</span>
                </tabbar-item>
                <tabbar-item selected link="/common/clean">
                  <img slot="icon" src="../assets/logo.png" alt="">
                  <span slot="label">Explore</span>
                </tabbar-item>
                <tabbar-item badge="2" link="/common/detect">
                  <img slot="icon" src="../assets/logo.png" alt="">
                  <span slot="label">News</span>
                </tabbar-item>
              </div>
            </swiper-item>
          </swiper>
        </div>

        <!--&lt;!&ndash;</group>&ndash;&gt;-->
      </div>
    </popup>
  </div>
</template>

<script>
  import { TransferDom, Popup, Group, Cell, XSwitch, Toast, Tab, TabItem, Tabbar, TabbarItem, Swiper, SwiperItem } from 'vux'
  export default {
    name: "cruise",
    directives: {
      TransferDom
    },
    components: {
      Popup,
      Group,
      Cell,
      XSwitch,
      Toast,
      Tabbar,
      TabbarItem,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
    },
    methods: {
      onClickClean(item) {
        if (item === '区域清洁') {
          console.log('区域清洁');
        } else {
          console.log('延边清洁');
        }
      },
    },
    computed: {
      showPopup: {
        get() {
          return this.$store.getters.changeShow
        },
        set(value) {
          this.$store.commit('changeShow', value)
        },
      }
    },
    watch: {
      cruiseShow(val) {
        this.cruise = val;
        console.log(val);
      }
    },
    data () {
      return {
        cruise: false,
        list: ['区域清洁', '延边清洁'],
        index: 0,
        clean: '区域清洁',
      }
    },
  }
</script>

<style lang="less">
  .popup {
    position: fixed;
    z-index: 100;
  }
  .show {
    width: 97%;
    background-color: #fff;
    height: 292px;
    margin: 0 auto;
    /*border-radius: 0.15rem;*/
  }
  .tab-swiper .vux-swiper{
    height: 248px !important;
    background-color: #fff;
  }
</style>
