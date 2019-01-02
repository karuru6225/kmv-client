import { push } from 'react-router-redux';
import axios from 'axios';
import store from '../store';
import { actions as commonAction } from '../modules/common/action';
import { actions as authAction } from '../modules/auth/action';
import { storage, storageKey } from './consts';

const inst = axios.create({
  baseURL: process.env.API_ENTRY
});

inst.interceptors.request.use((config) => {
  store.dispatch(commonAction.load_start());
  return config;
});

inst.interceptors.response.use((response) => {
  store.dispatch(commonAction.load_finish());
  return response;
}, (error) => {
  store.dispatch(commonAction.load_finish());
  if (error.response &&
      error.response.status === 401
  ) {
    // console.log(window.location.href);
    // console.log(JSON.stringify(error));
    // console.log(JSON.stringify(error.response));
    store.dispatch(authAction.logouted());
    store.dispatch(push('/login'));
    /* store.dispatch(replace({
      pathname: '/login',
      search: `?from=${window.location.href}`
    }));
    window.location.reload();
    */
  }
  return Promise.reject(error);
});

export const setToken = (token) => {
  inst.defaults.headers.common['x-kmv-token'] = token;
  storage.setItem(storageKey, token);
};

export const clearToken = () => {
  inst.defaults.headers.common['x-kmv-token'] = null;
  storage.removeItem(storageKey);
};

export const auth = {
  login: (username, password) => {
    return inst.post('auth', {
      username,
      password
    });
  },
  logout: () => {
    return inst.delete('auth');
  }
};

export const file = {
  get: id => inst.get(`file/${id||''}`)
}

export const directory = {
  get: id => inst.get(`dir/${id||''}`),
  refresh: id => inst.put(`dir/${id||''}`)
};


