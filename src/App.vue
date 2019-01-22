<template>
  <div id="app">
    <router-view name="index" v-if="false"></router-view>
    <drawer
      :show="drawerShow"
      :pos="pos"
      :tran="tran"
      @change-show="changeDrawerShow"
      @on-hide="onHide"
      @on-show="onShow"
      v-if="true">
      <!-- v-if="path !== '/'" -->
      <!-- 菜单内容 -->
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
      <!-- 主页内容 -->
      <view-box ref="viewBox">
        <x-header :left-options="{showBack: false}">
          <x-icon @click.native="drawerToggle" slot="overwrite-left" type="navicon" size="35" class="over"></x-icon>
          <div>
            <popover placement="bottom" style="margin:0px;">
              <div slot="content" class="popover-demo-content">
                <div v-for="ship in shipList" >
                  <x-button @click.native="confirmShow(ship)" style="padding:10px 20px 10px 20px; background-color:#35495e;border-style:hidden;color:white">{{ship.name}}</x-button>
                  <hr>
                </div>
              </div>
              <x-button class="btn btn-default" style="background-color:#35495e;font-size:20px;border-style:hidden;color:white">{{headerTop}}</x-button>

            </popover>
           <!-- <p>其实这是一个下拉框<p>-->
            <popover placement="bottom" style="margin:0px;">
              <div slot="content" class="popover-demo-content">
                <p>这里用来输出船的相关信息</p>
              </div>
              <button  class="my-btn vux-header-right"><i style="color:white;font-size:20px " class="el-icon-view"></i></button>
            </popover>
          </div>
        </x-header>
        <div class="view">
          <router-view :webUrl="webUrl"></router-view>
        </div>
        <tabbar icon-class="vux-center" slot="bottom"> <!-- v-show="" -->
          <tabbar-item @click.native="cruiseShowToggle">
            <img slot="icon" src="../static/image/logo.png" alt=""/>
            <span slot="label">自主巡航</span>
          </tabbar-item>
          <tabbar-item @on-item-click="cleanShowToggle">
            <img slot="icon" src="../static/image/logo.png" alt=""/>
            <span slot="label">智慧清洁</span>
          </tabbar-item>
          <tabbar-item @on-item-click="detectShowToggle">
            <img slot="icon" src="../static/image/logo.png" alt=""/>
            <span slot="label">水质监测</span>
          </tabbar-item>
        </tabbar>
      </view-box>
    </drawer>

    <div v-transfer-dom>
      <confirm v-model="show"
               :title="'确定换一艘船'"
               @on-cancel="onCancel"
               @on-confirm="onConfirm"
               @on-show="onShow"
               @on-hide="onHide">
        <p style="text-align:center;">Are you sure?</p>
      </confirm>
    </div>
  </div>


</template>

<script>
  import { ViewBox, XHeader, Confirm,Tabbar, TabbarItem, Group, Cell, ButtonTab, ButtonTabItem ,Popover,Checklist,TransferDom,XButton} from 'vux'
  import Drawer from '@/components/drawer.vue'
  import { getCookie } from './utils/cookie'

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
      Popover,
      Checklist,
      Confirm,
      XButton
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
        cookie: false,
        headerTop:'请选择船',
        shipList:[{name:'浐灞121231231' ,value:0},{name:'兴庆3dsvsvwdvds',value:1}],
        ship:['浐灞'],
        show:false,
       // present:0,
        temp:0,

      }
    },
    mounted() {
      this.created();
    },
    methods: {

      onCancel () {
        console.log('on cancel')
      },
      onConfirm (msg) {//确定要换一艘船
        console.log('on confirm')
        if (msg) {
          alert(msg);
        }
       // this.present = this.temp.value;  //把刚才临时保存的值给当前的值
        this.$store.commit('shipChooseId',this.temp.value);
        this.headerTop = this.temp.name;
       // 确定要切换船，就要切换

      },
      confirmShow(ship){
        this.show = true;
        this.temp = ship;//临时把这个船的id存起来

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
      '$route' (to, from) {
        console.log(...this.paths);
        this.path = to.path;
        // if (this.path === '/' && getCookie("AppCookieToken")) {
        //   this.$router.push({
        //     path: '/home',
        //     query: { redirect: to.fullPath },
        //   });
        // }
        // this.drawerShow = false; // 路由跳转、关闭侧边栏

        if (getCookie("AppCookieToken")) {
          this.cookie = true;
        }
        this.drawerShow = false; // 路由跳转、关闭侧边栏
      }
    },
    directives: {
      TransferDom
    },
  }
</script>

<style scoped lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/tap.less';

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
    .view-ship {
      margin:5px 30px 5px 30px !important;
    }
  }
  .my-btn{
    width:32px;
    height:32px;
    border-radius: 15px;
    background-color:#35495e;
    border: hidden;
    margin-right: 5px;

  }
  .my-btn :focus{//点击按钮之后没有边框
    outline: 0;
  }
</style>
