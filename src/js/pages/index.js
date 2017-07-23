import Vue from 'vue';
import Vuex from 'vuex';
import { sync } from 'vuex-router-sync';
import '../../css/base.scss';
import 'img/favicon.ico';
import router from 'router.js';
import axios from 'utils/ajax.js';

import dir from 'stores/dir.js';
import book from 'stores/book.js';
import movie from 'stores/movie.js';
import auth from 'stores/auth.js';

const store = new Vuex.Store({
  modules: {
    dir,
    auth,
    book,
    movie
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
