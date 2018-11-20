import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

const Login = reslove => require(['@/views/login.vue'], reslove)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登陆',
      component: Login
    },
    {
      path: '/helloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
