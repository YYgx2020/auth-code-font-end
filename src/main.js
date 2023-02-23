import Vue from 'vue'
import App from './App.vue'
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import Clipboard from 'clipboard';

import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.prototype.$axios = axios  // 将axios绑定到vue的原型上
Vue.prototype.clipboard = Clipboard;

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
