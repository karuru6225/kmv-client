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
    currentPage: 0,
    fileCount: null
  },
  mutations: {
    initEntries(state) {
      state.id = '';
      state.parentId = '';
      state.name = '';
      state.images = [];
      state.imageStatuses = [];
      state.loaded = 0;
      state.currentPage = 0;
      state.fileCount = 0;
    },
    updateEntries(state, payload) {
      state.id = payload.data.id;
      state.parentId = payload.data.parentId;
      state.name = payload.data.name;

      state.fileCount = +payload.data.fileCount;
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
    setCurrentPage(state, page){
      const nextPage = Math.max(Math.min(page, state.fileCount - 1), 0);
      const delta = nextPage - state.currentPage;

      switch(delta){
        case -1:
        case 1:
          state.currentPage = nextPage;
          return;
        case 2:
          if( state.imageStatuses[state.currentPage] != LOADED ){
            return;
          }
          if( state.imageStatuses[state.currentPage + 1] != LOADED ){
            return;
          }
          const img3 = state.images[state.currentPage];
          const img4 = state.images[state.currentPage + 1];
          if(img3.width > img3.height || img4.width > img4.height){
            state.currentPage = nextPage - 1;
            return;
          }else{
            state.currentPage = nextPage;
            return;
          }
        case -2:
          if( state.imageStatuses[nextPage] != LOADED ){
            return;
          }
          if( state.imageStatuses[nextPage + 1] != LOADED ){
            return;
          }
          const img1 = state.images[nextPage];
          const img2 = state.images[nextPage + 1];
          if( img1.width > img1.height || img2.width > img2.height){
            state.currentPage = nextPage + 1;
            return;
          }else{
            state.currentPage = nextPage;
            return;
          }
        default:
          state.currentPage = nextPage;
          return;
      }


    }
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
        clearInterval(loaderTimer);
      }
      const id = payload.id;
      const type = payload.type;
      let bufferLength = 5;
      loaderTimer = setInterval(() => {
        let loading = 0;
        let i = 0;
        if(!state.fileCount){
          return;
        }
        for(i = 0; i < state.fileCount; i++){
          const fid = (state.currentPage + i + state.fileCount) % state.fileCount;
          if( state.imageStatuses[fid] == LOADING ){
            if( i == 0 ){
              if(bufferLength < 20){
                bufferLength += 5;
                console.log('bufferLength: ' + bufferLength);
              }
            }
            loading++;
            continue;
          }else if( state.imageStatuses[fid] == LOADED ){
            continue;
          }
          if(loading > 3){
            break;
          }
          if(i > bufferLength){
            break;
          }
          const base = axios.defaults.baseURL;
          const w = window.innerWidth * 2;
          const h = window.innerHeight * 2;
          const path = `${type}/${id}/${fid}/resize/${w}/${h}`;
          //const path = `${type}/${id}/${fid}`;

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
        if( i == state.fileCount ){
          clearInterval(loaderTimer);
        }
      }, loaderInterval);
    }
  }
};
