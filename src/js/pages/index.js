import Vue from 'vue';
import Vuex from 'vuex';
import { sync } from 'vuex-router-sync';
import '../../css/base.scss';
import 'img/favicon.ico';
import router from 'router.js';
import axios from 'utils/ajax.js';

import store from 'stores/index.js';

store.commit('auth/restoreToken');

sync(store, router);

(new Vue({
  store,
  router
})).$mount('#app');

/*new Vue({
  el: '#app',
  store,
  render: h => h(TopPage)
});*/
