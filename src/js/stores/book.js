import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'utils/ajax.js';

Vue.use(Vuex);

//export const mutationTypes = { };

let loaderTimer = null;
const loaderInterval = 100;

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
      state.parentId = payload.data.parentId;
      state.name = payload.data.name;

      state.fileCount = +payload.data.fileCount;
      state.loadedImages = [];
      state.images = [];
      state.imageStatuses = [];
      state.loaded = 0;
      for(let i = 0; i < payload.data.fileCount; i++){
        Vue.set(state.imageStatuses, i, BEFORE_LOAD);
      }
    },
    startedLoadImage(state, payload){
      Vue.set(state.imageStatuses, +payload.fid, LOADING);
    },
    setImage(state, payload){
      Vue.set(state.imageStatuses, +payload.fid, payload.status);
      state.images[+payload.fid] = payload.content;
      let loaded = 0;
      for(let i = 0; i < state.fileCount; i++){
        if(state.imageStatuses[i] == LOADED){
          loaded++;
        }
      }
      state.loaded = loaded;
    },
  },
  actions: {
    files({commit}, payload){
      console.log('stopLoadImages');
      clearTimeout(loaderTimer);
      commit('initEntries');
      axios.get(`${payload.type}/${payload.id}`)
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
      const loader = function(commit, id, type, offset) {
        let loading = 0;
        let i = 0;
        if(!state.fileCount){
          loaderTimer = setTimeout(loader.bind(null, commit, id, type, offset), loaderInterval);
          return;
        }
        for(i = 0; i < state.fileCount; i++){
          const fid = (offset + i + state.fileCount) % state.fileCount;
          if( state.imageStatuses[fid] == LOADING ){
            loading++;
            continue;
          }else if( state.imageStatuses[fid] == LOADED ){
            continue;
          }
          if(loading > 3){
            loaderTimer = setTimeout(loader.bind(null, commit, id, type, offset), loaderInterval);
            break;
          }
          const base = axios.defaults.baseURL;
          const w = window.innerWidth;
          const h = window.innerHeight;
          //const path = `${type}/${id}/${fid}/resize/${w}/${h}`;
          const path = `${type}/${id}/${fid}`;

          // CORSのpreflightアクセスを防ぐために一時的にカスタムヘッダーを無効にする。
          // サーバー側で画像リサイズ用のURLのときの、preflightアクセスに対応した
          //const token = axios.defaults.headers.common['x-kmv-token'];
          //delete axios.defaults.headers.common['x-kmv-token'];
          axios.get(path, {
            responseType: 'blob',
            /*params: {
              token: token
            }*/
          }).then(res => {
            return new Promise( function(resolve, reject) {
              const url = window.URL || window.webkitURL;
              if(url){
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject();
                img.src = url.createObjectURL(res.data);
                return img;
              }else{
                commit('setImage', {
                  fid,
                  content: null,
                  status: BEFORE_LOAD
                });
                return false;
              }
            });
          }).then(img => {
            if(img){
              commit('setImage', {
                fid,
                content: img,
                status: LOADED
              });
            }
          }).catch(img => {
            commit('setImage', {
              fid,
              content: null,
              status: BEFORE_LOAD
            });
          });
          //axios.defaults.headers.common['x-kmv-token'] = token;

          commit('startedLoadImage', {
            fid
          });
          loading++;
        }
      };
      loaderTimer = setTimeout(loader.bind(null, commit, payload.id, payload.type, +payload.offset), 0);
    }
  }
};
