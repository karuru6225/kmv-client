import Vue from 'vue';
import Vuex from 'vuex';
import router from 'router.js';
import axios from 'utils/ajax.js';
import {getUrlFromFile} from 'utils/consts.js';

Vue.use(Vuex);

function satilation(state, idx){
  return Math.min(Math.max(0, idx), state.files.length - 1);
}

function seqNext(state, idx){
  if(idx){
    state.index = satilation(idx);
  }else{
    state.index = satilation(state.index + 1);
  }
  const url = getUrlFromFile(state.files[ state.index ]);
  router.push(url);
}

function ranNext(state){
  state.index = Math.floor(Math.random() * state.files.length);
  const url = getUrlFromFile(state.files[ state.index ]);
  router.push(url);
}

export default {
  namespaced: true,
  state: {
    show: false,
    playing: false,
    index: 0,
    lists: [],
    selected: null,
    random: true,
    files: []
  },
  mutations: {
    setLists(state, payload){
      state.lists = payload || [];
    },
    selectList(state, payload){
      state.selected = payload;
    },
    setFiles(state, payload){
      state.files = payload;
    },
    toggle(state){
      state.show = !state.show;
    },
    next(state){
      if(state.random){
        ranNext(state);
      }else{
        seqNext(state);
      }
    },
    toggleRandom(state){
      state.random = !state.random;
    },
    setPlaying(state, payload){
      if(payload !== undefined){
        state.playing = payload;
      }else{
        state.playing = !state.playing;
      }
      if(!state.playing){
        return;
      }
      if(state.random){
        ranNext(state);
      }else{
        seqNext(state, 0);
      }
    }
  },
  actions: {
    lists({commit}){
      axios.get('list')
        .then( res => {
          commit('setLists', res.data);
        });
    },
    unselect({commit}){
      commit('selectList', null);
      commit('setFiles', []);
    },
    add({commit, state, dispatch}, fileId){
      if(state.selected){
        axios.post(`list/${state.selected.id}`, {fileId})
          .then( _ => {
            dispatch('select', state.selected.id);
          });
      }
    },
    remove({commit, state, dispatch}, fileId){
      if(state.selected){
        axios.delete(`list/${state.selected.id}/${fileId}`)
          .then( _ => {
            dispatch('select', state.selected.id);
          });
      }
    },
    select({commit, state}, id){
      axios.get(`list/${id}`)
        .then( res => {
          commit('selectList', res.data);
        });
      axios.get(`list/${id}/files`)
        .then( res => {
          commit('setFiles', res.data);
        });
    },
    togglePlay({commit, state, dispatch}){
      if(state.selected){
        commit('setPlaying');
        return;
      }
      commit('setPlaying', false);
    }
  }
}
