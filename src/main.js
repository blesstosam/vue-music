
import 'babel-polyfill'   //要写在第一行

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './assets/stylus/index.styl'

//移动端调试工具
import vConsole from 'vconsole';


import fastclick from 'fastclick'   //解决手机点击延迟
fastclick.attach(document.body);    //绑定到body DOM

import axios from 'axios';          //axios没有封装jsonp方法
import VueAxios from 'vue-axios';

Vue.use(VueAxios,axios);            //VueAxios和axios要放在一起，而且顺序不能错，否则报错

import VueLazyLoad from 'vue-lazyload';
Vue.use(VueLazyLoad,{
  loading:require('./assets/image/default.png')    //请求图片返回之前的默认图片
});



Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
