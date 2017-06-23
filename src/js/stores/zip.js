import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'utils/ajax.js';

Vue.use(Vuex);

//export const mutationTypes = { };

let loaderTimer = null;

const BEFORE_LOAD = 0;
const LOADING = 1;
const LOADED = 2;

export default {
  namespaced: true,
  state: {
    id: '',
    parentId: '',
    name: '',
    images: [],
    imageStatuses: [],
    loaded: 0,
    fileCount: null
  },
  mutations: {
    initEntries(state) {
      state.id = '';
      state.fileCount = 0;
      state.parentId = '';
      state.name = '';
      state.loadedImages = [];
      state.images = [];
      state.imageStatuses = [];
      state.loaded = 0;
    },
    updateEntries(state, payload) {
      state.id = payload.data.id;
      state.fileCount = payload.data.fileCount;
      state.parentId = payload.data.parentId;
      state.name = payload.data.name;
      state.loadedImages = [];
      state.images = [];
      state.loaded = 0;
      for(let i = 0; i < payload.data.fileCount; i++){
        Vue.set(state.imageStatuses, i, BEFORE_LOAD);
      }
    },
    startedLoadImage(state, payload){
      Vue.set(state.imageStatuses, +payload.fid, LOADING);
    },
    loadedImage(state, payload){
      Vue.set(state.imageStatuses, +payload.fid, LOADED);
      state.images[+payload.fid] = payload.content;
      let loaded = 0;
      for(let i = 0; i < state.fileCount; i++){
        if(state.imageStatuses[i] == LOADED){
          loaded++;
        }
      }
      state.loaded = loaded;
    }
  },
  actions: {
    files({commit}, payload){
      axios.get('zip/' + payload.id)
        .then( res => {
          commit('updateEntries', {
            data: res.data,
            page: payload.page
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    stopLoadImages({commit}){
      console.log('stopLoadImages');
      clearTimeout(loaderTimer);
      commit('initEntries');
    },
    startLoadImages({commit, state}, payload){
      if(loaderTimer){
        clearTimeout(loaderTimer);
      }
      const w = Math.floor(window.innerWidth / 2);
      const h = window.innerHeight;
      const loader = () => {
        let loading = 0;
        let i = 0;
        if(!state.fileCount){
          loaderTimer = setTimeout(loader, 500);
          return;
        }
        for(i = 0; i < state.fileCount; i++){
          const fid = (+payload.offset + i + state.fileCount) % state.fileCount;
          if( state.imageStatuses[fid] == LOADING ){
            loading++;
            continue;
          }else if( state.imageStatuses[fid] == LOADED ){
            continue;
          }
          if(loading > 10){
            loaderTimer = setTimeout(loader, 500);
            break;
          }
          const base = axios.defaults.baseURL;
          const path = `zip/${state.id}/${fid}/resize/${w}/${h}`;

          const token = axios.defaults.headers.common['x-kmv-token'];
          delete axios.defaults.headers.common['x-kmv-token'];
          axios.get(path, {
            responseType: 'blob',
            params: {
              token: token
            }
          }).then(res => {
            commit('loadedImage', {
              fid,
              content: res.data
            });
          });
          axios.defaults.headers.common['x-kmv-token'] = token;

          commit('startedLoadImage', {
            fid
          });
          loading++;
        }
      };
      loaderTimer = setTimeout(loader, 0);
    }
  }
};