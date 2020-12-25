import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js' 
import axios from 'axios'
import {getStore, setStore} from './utils/storage'
Vue.prototype.$http = axios
Vue.config.productionTip = false

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)
Vue.use(VueLazyload,{
  preLoad: 1.3,
  error:'static/iamges/error.png',
  loading:'static/images/load.gif',
  attempt:1
})


//守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'SCUT MALL'
  const token = getStore('token')
  axios.get(`/server/api/validate?authorization=${token}`)
    .then((response) => {
      let data = response.data;
      console.log(data);
      if (!data.success) {
        // 用户要登录
        if (to.matched.some(record => record.meta.auth)) {
          // 用户未登录 需要跳转登录页面
          next({
            path: '/login',
            query: {
              redirect: to.fullPath
            }
          })
        } else {
          next();
        }
      } 
      else {
        // 保存用户的信息
        let {token,id, name, sex, college, major, dormitory} = data
        store.commit('ISLOGIN', {token, id, name, sex, college, major, dormitory});
        setStore("token", token);
        if (to.path === '/login') {
          router.push({
            path: '/'
          })
        }
        next();
      }
    })
    .catch(function (error) {
    });
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
