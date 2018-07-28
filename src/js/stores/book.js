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
    fileCount: null,
    loading: false,
    resolution: 2
  },
  mutations: {
    toggleResolution(state) {
      state.resolution += 1;
      if (state.resolution > 3) {
        state.resolution = 1;
      }
      state.images = [];
      state.imageStatuses = [];
      for(let i = 0; i < payload.data.fileCount; i++){
        Vue.set(state.imageStatuses, i, BEFORE_LOAD);
      }
      state.loaded = 0;
    },
    setLoading(state, isLoading){
      state.loading = isLoading;
    },
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
      if(payload.id != state.id) {
        console.log(payload);
        return;
      }
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
      clearTimeout(loaderTimer);
      commit('initEntries');
      commit('setLoading', true);
      axios.get(`${payload.type}/${payload.id}`)
        .then( res => {
          if( res.data.fileCount == 0 ){
            console.log('commit bookmark/next from book.js');
            commit('bookmark/next', null, {root:true});
          }else{
            commit('updateEntries', {
              data: res.data
            });
          }
          commit('setLoading', false);
        })
        .catch(err => {
          console.log(err);
          commit('setLoading', false);
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
      let bufferLength = 10;
      loaderTimer = setInterval(() => {
        let loading = 0;
        let i = 0;
        if(!state.fileCount){
          return;
        }
        for(i = 0; i < state.fileCount; i++){
          // 現在位置のページから前後に広がるように画像をロードする
          let fid;
          if(i%2 == 0){
            fid = (state.currentPage + i/2) % state.fileCount;
          }else{
            fid = (state.currentPage - (i-1)/2 + state.fileCount) % state.fileCount;
          }
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
          const mul = state.resolution;
          const w = mul * window.innerWidth;
          const h = mul * window.innerHeight;
          const pathResized = `${type}/${id}/${fid}/resize/${w}/${h}`;
          const path = `${type}/${id}/${fid}`;

          const successLoadImg = (res) => {
            return new Promise( function(resolve, reject) {
              const url = window.URL || window.webkitURL;
              if(url){
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url.createObjectURL(res.data);
                return img;
              }else{
                commit('setImage', {
                  id,
                  fid,
                  content: null,
                  status: BEFORE_LOAD
                });
                return false;
              }
            });
          };
          const successSetImg = (img) => {
            if(img){
              commit('setImage', {
                id,
                fid,
                content: img,
                status: LOADED
              });
            }
          };
          axios.get(pathResized, {
            responseType: 'blob',
          }).then(successLoadImg)
          .then(successSetImg)
          .catch((res) => {
            console.log('load error');
            if(res.response.status == 415) {
              console.log('load base image');
              axios.get(path, {
                responseType: 'blob',
              }).then(successLoadImg)
              .then(successSetImg)
              .catch(_ => {
                commit('setImage', {
                  id,
                  fid,
                  content: null,
                  status: BEFORE_LOAD
                });
              });
            }else{
              commit('setImage', {
                id,
                fid,
                content: null,
                status: BEFORE_LOAD
              });
            }
          });

          commit('startedLoadImage', {
            fid
          });
          loading++;
        }
        // if( i == state.fileCount ){
        //   clearInterval(loaderTimer);
        // }
      }, loaderInterval);
    }
  }
};
