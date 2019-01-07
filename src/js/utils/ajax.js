import { push } from 'react-router-redux';
import axios from 'axios';
import store from '../store';
import { actions as commonAction } from '../modules/common/action';
import { actions as authAction } from '../modules/auth/action';
import { storage, storageKey } from './consts';

const inst = axios.create({
  baseURL: process.env.API_ENTRY
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
    store.dispatch(commonAction.load_start());
    return inst.post('auth', {
      username,
      password
    });
  },
  logout: () => {
    store.dispatch(commonAction.load_start());
    return inst.delete('auth');
  }
};

export const file = {
  get: (id) => {
    store.dispatch(commonAction.load_start());
    return inst.get(`file/${id||''}`)
  }
}

export const directory = {
  get: (id) => {
    store.dispatch(commonAction.load_start());
    return inst.get(`dir/${id||''}`);
  },
  refresh: (id) => {
    store.dispatch(commonAction.load_start());
    return inst.put(`dir/${id||''}`)
  }
};

export const history = {
  getList: () => {
    store.dispatch(commonAction.load_start());
    return inst.get('history');
  },
  save: (fileId, index, auto = true) => {
    return inst.post('history', {
      fileId,
      index,
      auto
    })
  }
};

export const book = {
  getMeta: (type, id) => {
    store.dispatch(commonAction.load_start());
    return inst.get(`${type}/${id}`)
  },
  getImage: (type, id, page, resolution = 1) => {
    const r = resolution;
    const w = Math.round(window.innerWidth * r);
    const h = Math.round(window.innerHeight * r);
    const path = r === 1 ? `${type}/${id}/${page}` : `${type}/${id}/${page}/resize/${w}/${h}`
    return inst.get(path, {
      responseType: 'blob'
    }).then((res) => {
      const URL = window.URL || window.webkitURL;
      const img = new Image();
      img.src = URL.createObjectURL(res.data);
      return img;
    });
  }
};
