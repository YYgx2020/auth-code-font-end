import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/Login'),
    meta: {
      title: '登录',
      index: 1,
    }
  },
  {
    path: 'home',
    name: 'home',
    component: () => import('@/views/Home'),
    meta: {
      title: '首页',
      index: 2,
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router