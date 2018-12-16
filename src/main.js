// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueAMap from 'vue-amap'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import router from './router/index'
import { ToastPlugin } from 'vux'
import toastMessages from './utils/global/toast'
import store from './store'
import variable from './utils/global/variable'
// import lngLat from './utils/global/lngLat'
// import VueSocketio from 'vue-socket.io'

Vue.use(VueAMap);
Vue.use(MintUI);
Vue.use(ToastPlugin);
Vue.use(toastMessages);
// Vue.use(lngLat);

VueAMap.initAMapApiLoader({
  key: '87f1af7c4b4d86a7bd13155c3bc4ac31',
  plugin: ['AMap.ToolBar', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.ElasticMarker'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.11',
  // 高德 UI 组件库版本号
  uiVersion: '1.0.11'
});

Vue.prototype.$variable = variable;

// Vue.use(VueSocketio, 'ws://vps.orca-tech.cn:9001');

Vue.config.productionTip = false;

const FastClick = require('fastclick');
FastClick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
});
