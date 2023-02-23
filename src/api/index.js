import axios from '../utils/request';

// 登录接口
export function login(data) {
  return axios({
    url: '/api/user/login',
    method: 'post',
    data,
  })
}

// 注册接口
export function register(data) {
  return axios({
    url: '/api/user/register',
    method: 'post',
    data,
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  return axios({
    url: '/api/user/update',
    method: 'post',
    data,
  })
}

// 查找用户认证码
export function findUserCode(data) {
  return axios({
    url: '/api/user/findCode',
    method: 'post',
    data,
  })
}

// 获取用户信息
export function getUserInfo(data) {
  return axios({
    url: '/api/user/get',
    method: 'get',
    params: data,
  })
}