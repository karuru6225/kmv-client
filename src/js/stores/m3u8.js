import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'utils/ajax.js';

Vue.use(Vuex);

//export const mutationTypes = { };

export default {
  namespaced: true,
  state: {
    metadata: {name:''}
  },
  mutations: {
    meta(state, payload) {
      state.metadata = payload;
    }
  },
  actions: {
    meta({commit}, payload) {
      axios.get('file/' + payload.id)
        .then( res => {
          commit('meta', res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
