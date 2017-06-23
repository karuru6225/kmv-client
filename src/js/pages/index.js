import Vue from 'vue';
import Vuex from 'vuex';
import dir from 'stores/dir.js';
import zip from 'stores/zip.js';
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
  }
});

if(localStorage){
  axios.defaults.headers.common['x-kmv-token'] = localStorage.getItem('kmv-token');
}

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
