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
            <img class="img" src="./assets/-1719275449.jpg" alt="">
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
          <cell title="任务" link="/">
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
        </x-header>
        <div class="view">
          <router-view :webUrl="webUrl"></router-view>
        </div>
        <tabbar icon-class="vux-center" slot="bottom">
          <tabbar-item selected show-dot link="/cruise">
            <!--<router-link to="/cruise"></router-link>-->
            <img slot="icon" src="./assets/logo.png" alt=""/>
            <span slot="label">自主巡航</span>
          </tabbar-item>
          <tabbar-item link="/clean">
            <img slot="icon" src="./assets/logo.png" alt=""/>
            <span slot="label">智慧清洁</span>
          </tabbar-item>
          <tabbar-item badge="2" link="/detect">
            <img slot="icon" src="./assets/logo.png" alt=""/>
            <span slot="label">水质监测</span>
          </tabbar-item>
        </tabbar>
      </view-box>
    </drawer>
  </div>
</template>

<script>
  import { ViewBox, XHeader, Tabbar, TabbarItem, Group, Cell } from 'vux'
  import Drawer from '@/components/drawer.vue'
  import { getCookie } from '@/utils/cookie'
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
    },
    data() {
      return {
        webUrl: "",
        pos: 'left',   // 侧边栏从那边划入
        tran: 'overlay',   // 默认：overlay 展示方式:push(推开内容区域), overlay(在内容上显示)
        drawerShow: false,
        path: '',
        items: [],
        paths: [],
      }
    },
    mounted () {
      this.created();
    },
    methods: {
      drawerToggle() {
        this.drawerShow = !this.drawerShow
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
          this.items.push({
            name: route.name,
            path: route.path,
          });
          this.paths.push(route.path);
        })
      },
    },
    watch: {
      '$route' (to, from) {
        console.log(...this.paths);
        this.path = to.path;
        if (this.path === '/' && getCookie("AppCookieToken")) {
          this.$router.push({
            path: '/cruise',
            query: { redirect: to.fullPath },
          });
        }

        console.log(from);
        this.drawerShow = false;   // 路由跳转、关闭侧边栏
        // from.drawerToggle()
      }
    },
  }
</script>

<style lang="less">
  html {
    height: 100%;
  }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow-x: hidden;
  }
  #app {
    color: #2c3e50;
    width: 100%;
    height: 100%;
    font-family: Source Sans Pro, Helvetica, "microsoft yahei", sans-serif;
  }
  .over {
    fill: #fff;
    position: relative;
    top: -8px;
    left: -3px;
  }
  .avatar {
    width:1rem;
    height:1rem;
    overflow: hidden;
    border-radius: 50%;
    margin-left: 0.15rem;
    .img {
      width: 1rem; /* 130/75 */
      height: 1rem; /* 130/75 */
    }
  }
  .drawer {
    background-color: #efefef;
    height: 100%;
    .top {
      margin-top: -0.2rem;
    }
  }
  .head {
    background: url("./assets/background1.jpg");
    height: 2.2rem; /* 260/75 */
    width: 250px;
    max-width: 250px;
    background-size: 4rem 2.2rem; /* 260/75 */
    padding-top: 0.2rem;
    box-sizing: border-box;
  }
  .login {
    color: white;
    margin-top: 0.1rem;
    .log1 {
      font-size: 0.25rem;
      margin-left: 0.15rem;
    }
    .log2 {
      font-size: 0.23rem;
      margin-left: 0.15rem;
    }
  }
</style>
