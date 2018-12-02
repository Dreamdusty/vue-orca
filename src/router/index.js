import Vue from 'vue'
import Router from 'vue-router'
import { post, fetch, del, put } from '@/utils/http'
import { delCookie, getCookie } from '@/utils/cookie'

const Index = resolve => require(['/views/login'], resolve); // 登录
const Home = resolve => require(['/views/index/Home'], resolve); // 主页

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: '登录',
    component: Index
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {requireAuth: true},
    redirect: '/home',
    iconCls: '', // 图标
    children: [
      {path: '/home', name: '首页', component: Home, meta: {requireAuth: true}}
    ]
  }
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
  if(to.meta.requireAuth) {
    fetch('/api/mobile/verification').then(res => {
      console.log(res);
      if(res.code == 200) {
        next();
      } else {
        if (getCookie('AppCookieToken')) {
          delCookie('AppCookieToken');
        }
        next({
          path: '/'
        });
      }
    });
  } else {
    next();
  }
});

export default router;

