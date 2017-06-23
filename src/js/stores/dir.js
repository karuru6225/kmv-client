import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'utils/ajax.js';

Vue.use(Vuex);

//export const mutationTypes = { };

export default {
  namespaced: true,
  state: {
    files: [],
    current: {},
  },
  mutations: {
    cd(state, payload) {
      state.files = payload.files;
      state.current = payload.current;
    }
  },
  actions: {
    dir({commit}, payload) {
      console.log(payload);
      axios.get('dir/' + payload.id)
        .then( res => {
          const files = res.data.files.map( item => {
            return {
              id: item.id,
              mtime: new Date(item.mtime),
              name: item.name,
              size: item.size,
              type: item.type
            }
          });
          commit('cd', {
            current: res.data.current,
            files
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
