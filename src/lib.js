import axiosBase from 'axios';

export const axios = axiosBase.create({
  baseURL: 'http://54.64.236.161:3000'
});

let messages = [];

export const log = (mes) => {
  if (typeof mes === 'string') {
    messages.push(mes);
  } else {
    messages.push(JSON.stringify(mes));
  }
  document.getElementById('debug').innerText = messages.join('\n');
};

export const setToken = (token) => {
  axios.defaults.headers.common['x-kmv-token'] = token;
};
