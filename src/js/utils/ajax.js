// import router from 'router.js';
import { push } from 'react-router-redux';
import axios from 'axios';
import store from '../store';

const inst = axios.create({
  baseURL: API_ENTRY
});

inst.interceptors.response.use(response => response, (error) => {
  if (error.response && error.response.status === 401) {
    store.dispatch(push('/login'));
  }
  return Promise.reject(error);
});

export default inst;
