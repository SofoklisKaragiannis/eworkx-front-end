// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Notifications from 'vue-notification';
import App from './App';
import router from './router';

// Use notifications -> discount message
Vue.use(Notifications);

// json filter is now not bundled with vue
Vue.filter('json', x => JSON.stringify(x));

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
