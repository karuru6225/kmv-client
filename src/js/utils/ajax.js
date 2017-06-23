import router from 'router.js';
import axios from 'axios';

const inst = axios.create({
  baseURL: ApiEntry
});

inst.interceptors.response.use(function(response) {
  return response;
}, function(error){
  if(error.response && error.response.status == 401){
    router.push(PublicPath + 'login');
  }
  return Promise.reject(error);
});

export default inst;
