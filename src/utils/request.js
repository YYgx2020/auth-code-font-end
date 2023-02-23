// 封装 axios
import axios from 'axios'
import { Notification } from 'element-ui'

// const baseURL = process.env.NODE_ENV === 'production' ? 'https://www.lianghongyi.com': '/api'
const baseURL = process.env.VUE_APP_URL

let config = {
  baseURL: baseURL,
  timeout: 30000       //设置最大请求时间
}

const _axios = axios.create(config)

/* 请求拦截器（请求之前的操作） */
_axios.interceptors.request.use(req => {
  console.log('this: ', this);
  // console.log('store: ', store);
  // const token = store.state.token
  // if (token) {
  //   req.headers['authorization'] = "bearer " + token
  // } else {
  //   req.headers['authorization'] = "bearer "
  // }
  return req
}, err => {
  return Promise.reject(err)
})

/* 响应拦截器 */
_axios.interceptors.response.use(resp => {
  console.log('响应拦截器数据：', resp);
  const data = resp.data
  if (data.code != 200) {
    Notification({
      title: '错误',
      type: 'error',
      message: data.message,
    })
    return Promise.reject(data)
  }
  return resp
}, err => {
  console.log('拦截出错', err);
  if (err.response.status === 403) {
    localStorage.removeItem("token")
    localStorage.removeItem('userInfo')
    Notification({
      title: '错误',
      type: 'error',
      message: '登陆已过期,请重新登陆',
    })
  }
  return Promise.reject(err)
})

export default _axios