import Vue from 'vue';
import Router from 'vue-router';
import WebShop from '@/components/WebShop';

Vue.use(Router);

export default new Router({
  // just one route WebShop
  routes: [
    {
      path: '/',
      name: 'WebShop',
      component: WebShop,
    },
  ],
});
