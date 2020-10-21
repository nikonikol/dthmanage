// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入ui
import './plugins/element.js'
import './assets/styles/global.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 配置axios请求
import axios from 'axios'
// axios.defaults.baseURL = 'http://10.111.117.6:8086'
// window.imgBaseUrl='http://10.111.117.6:9191'
axios.defaults.baseURL = 'http://101.37.83.223:7008'
window.imgBaseUrl='http://101.37.83.223:7007'
// axios.defaults.baseURL = 'http://101.37.83.223:8181'
Vue.prototype.$http = axios

Vue.use(ElementUI);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
