import http from '/utils/http'

// 登录
export const userLogin = (params) => {
  return http.post('/api/mobile/login/account', params);
};
