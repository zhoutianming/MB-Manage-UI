import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
import './assets/css/icon.css'
import "babel-polyfill"
import Avatar from 'vue-avatar-component'

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
Vue.component('avatar', Avatar)
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8081'

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')