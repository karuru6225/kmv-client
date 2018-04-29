import { push } from 'react-router-redux';
import axios from 'axios';
import store from '../store';
import { actions as commonAction } from '../modules/common/action';
import { actions as authAction } from '../modules/auth/action';

const inst = axios.create({
  baseURL: API_ENTRY
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
    console.log(window.location.href);
    console.log(JSON.stringify(error));
    console.log(JSON.stringify(error.response));
    store.dispatch(authAction.logout_success());
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

export default inst;
