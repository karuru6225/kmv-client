import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'utils/ajax.js';

Vue.use(Vuex);

//export const mutationTypes = { };

function getFilesFromResponse(res){
  return res.data.files.map( item => {
    return {
      id: item.id,
      mtime: new Date(item.mtime),
      name: item.name,
      size: item.size,
      type: item.type
    }
  });
}

export default {
  namespaced: true,
  state: {
    files: [],
    current: {},
    previousId: ''
  },
  mutations: {
    cd(state, payload) {
      state.files = payload.files;
      state.current = payload.current;
    },
    previous(state, payload){
      state.previousId = payload;
    }
  },
  actions: {
    refresh({commit}, payload) {
      axios.put('dir/' + payload.id)
        .then( res => {
          const files = getFilesFromResponse(res);
          commit('cd', {
            current: res.data.current,
            files
          });
          if(payload.cb){
            payload.cb();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    dir({commit}, payload) {
      axios.get('dir/' + payload.id)
        .then( res => {
          const files = getFilesFromResponse(res);
          commit('cd', {
            current: res.data.current,
            files
          });
          if(payload.cb){
            payload.cb();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
