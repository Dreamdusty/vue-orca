import http from '/utils/http'
import { stringify } from "qs";

// params 对象 json
// uid=1，name=
// list?val=   val
// 登录
export const userLogin = (params) => {
  return http.post('api/mobile/login/account', params);
};

// bound
export const selectBound = (params) => {
  return http.get(`api/mobile/bound/list?${stringify(params)}`);
};

export const addRoute = (params) => {
  return http.post(`api/mobile/route/insert`, params);
};





