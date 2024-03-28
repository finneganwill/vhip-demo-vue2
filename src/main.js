import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import { EasyVhip } from 'vhip-easybuild-api';

import VueRouter from 'vue-router';
import { router } from './routers';

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(EasyVhip, { autoConnect: false });
Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
