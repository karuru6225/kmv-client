import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'utils/ajax.js';

Vue.use(Vuex);

//export const mutationTypes = { };

export default {
  namespaced: true,
  state: {
    file: {name:''}
  },
  mutations: {
    setFile(state, payload) {
      state.file = payload;
    }
  },
  actions: {
    meta({commit}, payload) {
      axios.get('file/' + payload.id)
        .then( res => {
          commit('setFile', res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
