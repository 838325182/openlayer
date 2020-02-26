import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import $ from 'jquery'
import echarts from 'echarts'
import GISConfig from "@/config/GISConfig.js";
import '@/style/map.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios;//axios全局挂载到VUE原型上
Vue.prototype.$echarts = echarts;
Vue.prototype.GISConfig = GISConfig;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
