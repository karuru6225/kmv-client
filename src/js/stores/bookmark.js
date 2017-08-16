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
    state.index = satilation(state, idx);
  }else{
    state.index = satilation(state, state.index + 1);
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
    playing: -1,
    index: 0,
    lists: [],
    selected: null,
    bookmarked: false,
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
    updateBookmarkStatus(state, fileId){
      const id = fileId && state
      const ib = state.selected && state.selected.files.findIndex(f => {
        return f.id == fileId
      }) != -1;
      state.bookmarked = ib;
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
    setPlaying(state, id){
      console.log('setPlaying: ' + id);
      state.playing = id;

      if(state.playing == -1){
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
    },
    select({commit, state, rootState}, id){
      axios.get(`list/${id}`)
        .then( res => {
          commit('selectList', res.data);
          const fid = rootState.file.current.id;
          commit('updateBookmarkStatus', fid);
        });
    },
    add({commit, state, dispatch}, fileId){
      if(state.selected){
        axios.post(`list/${state.selected.id}`, {fileId})
          .then(_=>{
            dispatch('select', state.selected.id);
          });
      }
    },
    remove({commit, state, dispatch}, fileId){
      if(state.selected){
        axios.delete(`list/${state.selected.id}/${fileId}`)
          .then(_=>{
            dispatch('select', state.selected.id);
          });
      }
    },
    togglePlay({commit, state, dispatch}, id){
      console.log(id);
      if(state.playing == id){
        commit('setFiles', []);
        commit('setPlaying', -1);
        return;
      }
      axios.get(`list/${id}/files`)
        .then( res => {
          console.log('after axiosgetlistidfiles: ' + id);
          commit('setFiles', res.data);
          commit('setPlaying', id);
        });
    }
  }
}
