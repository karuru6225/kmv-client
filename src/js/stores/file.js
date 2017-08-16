import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'utils/ajax.js';

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    current: {name:''}
  },
  mutations: {
    setFile(state, file){
      state.current = file;
    }
  },
  actions: {
    select({commit}, id){
      axios.get('file/' + id)
        .then( res => {
          commit('setFile', res.data);
          commit('bookmark/updateBookmarkStatus', id, {root:true});
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
}
