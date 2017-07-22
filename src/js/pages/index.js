import Vue from 'vue';
import Vuex from 'vuex';
import dir from 'stores/dir.js';
import zip from 'stores/zip.js';
import m3u8 from 'stores/m3u8.js';
import auth from 'stores/auth.js';
import { sync } from 'vuex-router-sync';
import '../../css/base.scss';
import 'img/favicon.ico';
import router from 'router.js';
import axios from 'utils/ajax.js';

const store = new Vuex.Store({
  modules: {
    dir,
    auth,
    zip,
    m3u8
  }
});

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
