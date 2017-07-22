import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'utils/ajax.js';
import router from 'router.js';

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    token: ''
  },
  mutations: {
    login(state, payload) {
      state.token = payload.token;
      axios.defaults.headers.common['x-kmv-token'] = payload.token;
      if(localStorage){
        localStorage.setItem('kmv-token', payload.token);
      }
      router.push(PublicPath);
    },
    restoreToken(state) {
      console.log('restoring');
      let token = '';
      if(localStorage){
        token = localStorage.getItem('kmv-token');
      }
      state.token = token;
      axios.defaults.headers.common['x-kmv-token'] = token;
    },
    logout(state) {
      axios.defaults.headers.common['x-kmv-token'] = '';
      router.push(PublicPath + 'login');
      if(localStorage){
        localStorage.removeItem('kmv-token');
      }
    }
  },
  actions: {
    login({commit}, payload){
      axios.post('auth', {
        username: payload.username,
        password: payload.password
      }).then( res => {
        commit('login', res.data);
      });
    },
    logout({commit}){
      axios.delete('auth').then( res => {
        commit('logout');
      });
    }
  }
}
