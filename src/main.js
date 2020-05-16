import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/base.css'
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
require('vue-video-player/src/custom-theme.css')
const hls =require("videojs-contrib-hls")
Vue.use(hls)
Vue.use(VideoPlayer)
axios.defaults.baseURL = 'http://localhost:8087'

Vue.config.productionTip = false
Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
