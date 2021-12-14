import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
import axios from 'axios'

import "./axios"
//路由拦截
import "./permission1"

//markdown式的组件
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(Element)
Vue.use(mavonEditor)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
