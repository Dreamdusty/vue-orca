<template>
  <div id="app">
    <!--<router-view name="index" v-if="!cookie"></router-view>-->
    <login v-if="!cookie"></login>
    <drawer
      :show.sync="drawerShow"
      :show-mode="tran"
      :placement="pos"
      @on-hide="onHide"
      @on-show="onShow"
      v-if="cookie"
      :style="img">
      <!-- 不执行 -->
      <!--@change-show="changeDrawerShow"-->
      <!-- v-if="path !== '/'" -->
      <!-- 菜单内容 -->
      <div slot="drawer" class="drawer">
        <div class="head">
          <!-- 头像 -->
          <div class="avatar">
            <img class="img" src="../static/img/avatar.jpg" alt="">
          </div>
          <div class="login">
            <p class="log1">欧卡小蓝船</p>
            <p class="log2">admin</p>
          </div>
        </div>
        <group class="top">
          <cell title="设置边界及避障" link="/">
          </cell>
          <cell title="路径" link="/">
          </cell>
          <cell title="数据" link="../views/demo">
          </cell>
          <cell title="任务" link="/">
          </cell>
          <cell title="个人设置" link="/">
          </cell>
        </group>
      </div>
      <!-- 主页内容 -->
      <view-box ref="viewBox">
        <x-header :left-options="{showBack: false}" style="height: 54px; background-color: rgba(255, 255, 255, 0)">
          <x-icon @click.native="drawerToggle" slot="overwrite-left" type="navicon" size="35" class="over"></x-icon>
          <div class="vpopover">
            <popover placement="bottom" style="margin:0px;">
              <div slot="content" class="popover-demo-content">
                <div class="popover-demo-content-ship" v-for="ship in shipList" :key="ship.id">
                  <x-button @click.native="confirmShow(ship)"
                            style="padding:0px 70px; color: #FFFFFF; background-color: rgba(255, 255, 255, 0); border-radius: 99px">
                    {{ship.name}}
                  </x-button>
                </div>
              </div>
              <x-button class="btn btn-default"
                        style="background-color: rgba(0, 0, 0, 0);font-size:20px;border-style:hidden;color:white">
                {{headerTop}}
              </x-button>
            </popover>
            <!-- <p>其实这是一个下拉框<p>-->
            <!--<popover placement="bottom" style="margin:0px;">-->
            <!--<div slot="content" class="popover-demo-content">-->
            <!--<p>这里用来输出船的相关信息</p>-->
            <!--</div>-->
            <!--<button class="my-btn vux-header-right"><i style="opacity:0;color:white;font-size:20px "-->
            <!--class="el-icon-view"></i></button>-->
            <!--</popover>-->
          </div>
        </x-header>
        <div class="view">
          <router-view :webUrl="webUrl"></router-view>
        </div>
        <tabbar icon-class="vux-center" slot="bottom" style="background-color: rgb(240, 240, 243);"><!-- v-show="" -->
          <tabbar-item @click.native="cruiseShowToggle">
            <img slot="icon" src="../static/img/home/cruise.png" alt=""/>
            <img slot="icon-active" src="../static/img/home/cruiseSelected.png" alt=""/>
            <span slot="label">自主巡航</span>
          </tabbar-item>
          <tabbar-item @on-item-click="cleanShowToggle">
            <img slot="icon" src="../static/img/home/clean.png" alt=""/>
            <img slot="icon-active" src="../static/img/home/cleanSelected.png" alt=""/>
            <span slot="label">智慧清洁</span>
          </tabbar-item>
          <tabbar-item @on-item-click="detectShowToggle">
            <img slot="icon" src="../static/img/home/detect.png" alt=""/>
            <img slot="icon-active" src="../static/img/home/detectSelected.png" alt=""/>
            <span slot="label">水质监测</span>
          </tabbar-item>
        </tabbar>
      </view-box>
    </drawer>
    <div v-transfer-dom style="border-radius: 50px;">
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
  import {
    Drawer,
    ViewBox,
    XHeader,
    Confirm,
    Tabbar,
    TabbarItem,
    Group,
    Cell,
    ButtonTab,
    ButtonTabItem,
    Popover,
    Checklist,
    TransferDom,
    XButton
  } from 'vux'
  import {getCookie} from './utils/cookie'
  import {changeShip} from './utils/socket';
  import login from './views/login';
  import store from './store'

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
      XButton,
      login
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
        ///headerTop:'请选择船',
        shipList: [{name: '浐灞01', value: 0}, {name: '丰庆', value: 1}, {name: '浐灞02', value: 2}],
        ship: ['浐灞'],
        show: false,
        //present:0,
        temp: 0,
        img: {
          backgroundImage: "url(" + require("../static/img/home/homeBack.png") + ") ",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
          width: "100%",
          height: "100%"
        },
      }
    },
    mounted() {
      this.created();
    },
    computed: {
      present: function () {
        return store.getters.shipChooseId;
      },
      finishTofuthree: function () {
        return store.getters.finishTofuthree;
      },
      headerTop: {
        get() {
          if (this.present === -1) {
            return '请选择船';
          } else {
            // console.log("改变名字");
            return this.shipList[this.present].name;
          }
        },
        set() {

        }
      },
      cookie: function () {
        return store.getters.cookie;
      }
    },
    methods: {
      onCancel() {
        console.log('on cancel')
      },
      onConfirm(msg) {//确定要换一艘船
        console.log('on confirm')
        if (msg) {
          alert(msg);
        }
        //  this.present = this.temp.value;  //把刚才临时保存的值给当前的值
        store.commit('shipChooseId', this.temp.value);
        this.headerTop = this.temp.name;
        // 确定要切换船，就要切换

      },
      confirmShow(ship) {
        this.show = true;
        this.temp = ship;//临时把这个船的id存起来
      },

      drawerToggle() {
        this.drawerShow = !this.drawerShow
      },
      cruiseShowToggle() {
        store.dispatch('cruiseShow').then();
      },
      cleanShowToggle() {
        store.dispatch('cleanShow').then();
      },
      detectShowToggle() {
        store.dispatch('detectShow').then();
      },
      onHide() {
        console.log('hide');
      },
      // changeDrawerShow(status) {
      //   this.drawerShow = status;
      //   console.log('drawer was changed from components');
      // },
      onShow() {
        console.log('show');
      },
      created() {
        this.$router.options.routes.forEach(route => {
          // console.log(route.path);
          this.items.push({
            name: route.name,
            path: route.path,
          });
          this.paths.push(route.path);
        })
      },
    },
    watch: {
      '$route'(to, from) {
        console.log(...this.paths);
        this.path = to.path;
        // if (this.path === '/' && getCookie("AppCookieToken")) {
        //   this.$router.push({
        //     path: '/home',
        //     query: { redirect: to.fullPath },
        //   });
        // }
        // this.drawerShow = false; // 路由跳转、关闭侧边栏

        // if (this.path === '/' && getCookie("AppCookieToken")) {
        if (getCookie("AppCookieToken")) {
          store.commit('cookie', true);
          this.$router.push({
            path: '/home',
          });
        }
        this.drawerShow = false; // 路由跳转、关闭侧边栏
      },
      present(newvalue, oldvalue) {
        changeShip(newvalue);
        // console.log("换船了"+previous+oldvalue);
      },

      finishTofuthree(newval) {
        console.log('状态变为-3');
        if (newval !== -1) {
          this.savefinish = newval;
          this.showEnd = true;
        }
        this.$store.commit('finishTofuthree', -1);
      }


    },
    directives: {
      TransferDom
    },
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/tap.less';

  html {
    height: 100% !important;
    overflow-y: hidden !important;
  }

  body {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: hidden !important;
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
    top: -5px !important;
    left: -3px !important;
  }

  .avatar {
    width: 1rem !important;
    height: 1rem !important;
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
    background: url("../static/img/background.png") !important;
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
      margin: 5px 30px 5px 30px !important;
    }
  }

  .my-btn {
    width: 32px;
    height: 32px;
    border-radius: 15px;
    background-color: #35495e;
    border: hidden;
    margin-right: 5px;

  }

  .my-btn :focus { //点击按钮之后没有边框
    outline: 0;
  }

  .vpopover, .vux-popover.v-transfer-dom {
    border-radius: 20px;
    margin-left: 0px;
  }

  .vpopover, .weui-btn.weui-btn_default:after {
    border: 1px none rgba(0, 0, 0, 0.2);
  }

  #vux_view_box_body {
    overflow: hidden;
  }

  /*.scroller-mask{*/
  /*top: -38px;*/
  /*}*/

  /*.scroller-indicator{*/
  /*top: 65px;*/
  /*}*/

  /*.weui-btn.weui-btn_primary{*/
  /*margin-top: -20px;*/
  /*}*/
</style>
