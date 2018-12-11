import Vue from 'vue'
import Router from 'vue-router'
import { post, fetch, del, put } from '@/utils/http'
import { delCookie, getCookie } from '@/utils/cookie'

const Index = resolve => require(['/views/login'], resolve); // 登录
const Home = resolve => require(['/views/home'], resolve); // 主页
// const Cruise = resolve => require(['/views/cruise/cruise'], resolve); // 自主巡航
// const Clean = resolve => require(['/views/clean/clean'], resolve); // 智慧清洁
// const Detect = resolve => require(['/views/detect/detect'], resolve); // 水质监测

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: '登录',
    component: Index,
    components: {
      index: Index,
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { requireAuth: false },
    iconCls: '',
  },
  // {
  //   path: '/cruise',
  //   name: 'cruise',
  //   component: Cruise,
  //   meta: { requireAuth: false },
  //   // redirect: '/cruise',
  //   iconCls: '', // 图标
  //   // children: [
  //   //   {
  //   //     path: '/cruise',
  //   //     name: 'cruise',
  //   //     component: Cruise,
  //   //     meta: { requireAuth: false },
  //   //   },
  //   // ]
  // },
  // {
  //   path: '/clean',
  //   name: 'clean',
  //   component: Clean,
  //   meta: { requireAuth: false },
  //   // redirect: '/clean',
  //   iconCls: '', // 图标
  //   // children: [
  //   //   {
  //   //     path: '/clean',
  //   //     name: 'clean',
  //   //     component: Clean,
  //   //     meta: { requireAuth: true }
  //   //   },
  //   // ]
  // },
  // {
  //   path: '/detect',
  //   name: 'detect',
  //   component: Detect,
  //   meta: { requireAuth: false },
  //   // redirect: '/detect',
  //   iconCls: '', // 图标
  //   // children: [
  //   //   {
  //   //     path: '/detect',
  //   //     name: 'detect',
  //   //     component: Detect,
  //   //     meta: { requireAuth: true }
  //   //   },
  //   // ]
  // },
];

const router = new Router({
  mode: 'history',
  routes
});

// 路由中的 meta:{requireAuth: true }，这个配置，主要为下面的验证做服务。
// 如果requireAuth: true ,那就判断用户是否存在。
// 如果存在，就继续执行下面的操作，如果不存在，就删除客户端的Cookie,同时页面跳转到登录页。
// 这个是请求页面路由的时候会验证token存不存在，不存在的话会到登录页
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    fetch('/api/mobile/verification').then(res => {
      if(res.code === 200) {
        next();
      } else {
        if (getCookie('AppCookieToken')) {
          delCookie('AppCookieToken');
        }
        next({
          path: '/',
          query: {redirect: to.fullPath}
        });
      }
    });
  } else {
    next();
  }
});

export default router;

