import http from '/utils/http'
import { stringify } from "qs";

// 登录
export const userLogin = (params) => {
  return http.post('/api/mobile/login/account', params);
};

// bound
export const selectBound = (params) => {
  return http.get(`/api/mobile/bound/list?${stringify(params)}`);
};
