<template>
  <div id="app">
    <router-view name="index"></router-view>
    <drawer
      :show="drawerShow"
      :pos="pos"
      :tran="tran"
      @change-show="changeDrawerShow"
      @on-hide="onHide"
      @on-show="onShow"
      v-if="path !== '/'">
      <!-- drawer content -->
      <div slot="drawer" class="drawer">
        <div class="head">
          <!-- 头像 -->
          <div class="avatar">
            <img class="img" src="../static/image/avatar.jpg" alt="">
          </div>
          <div class="login">
            <p class="log1">欧卡小蓝船</p>
            <p class="log2">admin</p>
          </div>
        </div>
        <group class="top">
          <cell title="主页" link="/">
          </cell>
          <cell title="设置边界及避障" link="/">
          </cell>
          <cell title="任务" link="../views/demo">
          </cell>
          <cell title="数据" link="/">
          </cell>
          <cell title="个人设置" link="/">
          </cell>
        </group>
      </div>
      <!-- main content -->
      <view-box ref="viewBox">
        <x-header :left-options="{showBack: false}">
          <x-icon @click.native="drawerToggle" slot="overwrite-left" type="navicon" size="35" class="over"></x-icon>
          <!--<button-tab @click.native="tou">-->
            <!--<button-tab-item>请选择船只</button-tab-item>-->
          <!--</button-tab>-->
          <div class="tou">
            <cell @click.native="tou">请选择船只</cell>
          </div>
        </x-header>
        <div class="view">
          <router-view :webUrl="webUrl"></router-view>
        </div>
        <tabbar icon-class="vux-center" slot="bottom"> <!-- v-show="" -->
          <tabbar-item @click.native="cruiseShowToggle">
            <!--<cruise :msgShow="cruiseshow"></cruise>-->
            <img slot="icon" src="../static/image/logo.png" alt=""/>
            <span slot="label">自主巡航</span>
          </tabbar-item>
          <tabbar-item @on-item-click="cleanShowToggle">
            <img slot="icon" src="../static/image/logo.png" alt=""/>
            <span slot="label">智慧清洁</span>
          </tabbar-item>
          <tabbar-item @on-item-click="detectShowToggle">
            <!--<detect :msgShow="detectShow"></detect>-->
            <img slot="icon" src="../static/image/logo.png" alt=""/>
            <span slot="label">水质监测</span>
          </tabbar-item>
        </tabbar>
      </view-box>
    </drawer>
    <!--<cruise></cruise>-->
    <!--<vessel></vessel>-->
  </div>
</template>

<script>
  import { ViewBox, XHeader, Tabbar, TabbarItem, Group, Cell, ButtonTab, ButtonTabItem } from 'vux'
  import Drawer from '@/components/drawer.vue'
  import { getCookie } from './utils/cookie'
  // import Bus from '@/assets/js/bus.js'

  export default {
    name: 'App',
    components: {
      ViewBox,
      Drawer,
      XHeader,
      Tabbar,
      TabbarItem,
      Group,
      Cell,
      ButtonTab,
      ButtonTabItem,
    },
    data() {
      return {
        webUrl: "",
        pos: 'left', // 侧边栏从那边划入
        tran: 'overlay', // 默认：overlay 展示方式:push(推开内容区域), overlay(在内容上显示)
        drawerShow: false,
        path: '',
        items: [],
        paths: [],
      }
    },
    mounted() {
      this.created();
    },
    methods: {
      tou() {
        console.log('tou');
      },
      drawerToggle() {
        this.drawerShow = !this.drawerShow
      },
      cruiseShowToggle() {
        // console.log('111');
        this.$store.dispatch('cruiseShow').then();
      },
      cleanShowToggle() {
        // console.log('111');
        this.$store.dispatch('cleanShow').then();
      },
      detectShowToggle() {
        // console.log('111');
        this.$store.dispatch('detectShow').then();
      },
      onHide() {
        console.log('hide');
      },
      changeDrawerShow(status) {
        this.drawerShow = status;
        console.log('drawer was changed from components');
      },
      onShow() {
        console.log('show');
      },
      created() {
        this.$router.options.routes.forEach(route => {
          console.log(route.path);
          this.items.push({
            name: route.name,
            path: route.path,
          });
          this.paths.push(route.path);
        })
      },
    },
    watch: {
      // '$route' (to, from) {
      //   console.log(...this.paths);
      //   this.path = to.path;
      //   if (this.path === '/' && getCookie("AppCookieToken")) {
      //     this.$router.push({
      //       path: '/home',
      //       query: { redirect: to.fullPath },
      //     });
      //   }
      //   this.drawerShow = false; // 路由跳转、关闭侧边栏
      // }
    },
  }
</script>

<style scoped lang="less">
  html {
    height: 100% !important;
  }
  body {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 100% !important;
    overflow-x: hidden !important;
  }
  #app {
    color: #2c3e50 !important;
    width: 100% !important;
    height: 100% !important;
    font-family: Source Sans Pro, Helvetica, "microsoft yahei", sans-serif !important;
    /*position: absolute !important;*/
  }
  .over {
    fill: #fff !important;
    position: relative !important;
    top: -8px !important;
    left: -3px !important;
  }
  .avatar {
    width:1rem !important;
    height:1rem !important;
    overflow: hidden !important;
    border-radius: 50% !important;
    margin-left: 0.15rem !important;
    .img {
      width: 1rem !important; /* 130/75 */
      height: 1rem !important; /* 130/75 */
    }
  }
  .drawer {
    background-color: #efefef !important;
    height: 100% !important;
    z-index: 999 !important;
    /*position: fixed !important;*/
    .top {
      margin-top: -0.2rem !important;
    }
  }
  .head {
    background: url("../static/image/background.png") !important;
    height: 2.2rem !important; /* 260/75 */
    width: 250px !important;
    max-width: 250px !important;
    background-size: 4.5rem 2.2rem !important;
    padding-top: 0.2rem !important;
    box-sizing: border-box !important;
  }
  .login {
    color: white !important;
    margin-top: 0.1rem !important;
    .log1 {
      font-size: 0.25rem !important;
      margin-left: 0.15rem !important;
    }
    .log2 {
      font-size: 0.23rem !important;
      margin-left: 0.15rem !important;
    }
  }
</style>
