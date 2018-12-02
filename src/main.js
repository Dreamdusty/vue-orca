// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import router from './router/index'
import { ToastPlugin } from 'vux'
import toastMessages from './utils/toast'

Vue.use(MintUI);
Vue.use(ToastPlugin);
Vue.use(toastMessages);

Vue.config.productionTip = false;

const FastClick = require('fastclick');
FastClick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
