import { axios, log } from './lib';

export const login = async (username, password) => {
  const res = await axios.post('/api/auth', {
    username,
    password
  });
  return res.data.token;
};

export const getMe = async () => {
  const res = await axios({
    method: 'get',
    url: '/api/user/me',
  });
  log(res.data);
};

export const getUsers = async () => {
  const res = await axios({
    method: 'get',
    url: '/api/user'
  });
  log(res.data);
};

export const createUser = async (username, password) => {
  const res = await axios({
    method: 'post',
    url: '/api/user',
    data: {
      username,
      password
    }
  });
  log(res);
};
