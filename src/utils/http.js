import axios from 'axios'
import { getCookie } from './cookie'

// axios 配置

// 请求的超时时间
axios.defaults.timeout = 5000;
// 允许携带cookie
axios.defaults.withCredentials = true;

// http request 拦截器
axios.interceptors.request.use(
  config => {
    const token = getCookie('AppCookieToken');
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/json; charset=utf-8',
    };
    if (token) {
      // 后台接收的参数
      config.params = {'token': token}
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // Cookie丢失，然后跳转到登录页
    console.log(response);
    if(response.code === 401) {
      router.push({
        path: '/login',
        // 从哪个页面跳转
        query: {redirect: router.currentRoute.fullPath}
      })
    }
    return response;
  },
  error => {
    return Promise.reject(error.response.data)
  });

export default axios;

/**
 * fetch 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * post 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      })
  })
}

/**
 * del 方法封装
 * @param url
 * @param params
 * @returns {Promise}
 */
export function del(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, params)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      })
  })
}

/**
 * put 方法封装
 * @param url
 * @param params
 * @returns {Promise}
 */
export function put(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, params)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      })
  })
}
