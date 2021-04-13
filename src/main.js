// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from "axios";
Vue.prototype.$axios = axios;

import Element from "element-ui"
import "element-ui/lib/theme-chalk/index.css"

Vue.use(Element)

Vue.config.productionTip = false

import "../static/css/global.css"
import settings from "./settings";

// 让自定义配置生效
import "../static/js/gt"

Vue.prototype.$settings = settings;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

