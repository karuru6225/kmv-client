import {
  createActions,
  handleActions
} from 'redux-actions';
import {
  fork,
  call,
  put,
  takeEvery
} from 'redux-saga/effects';
import {
  login,
  getUsers,
} from '../api';
import {
  setToken
} from '../lib';

export const actions = createActions({
  login: (username, password) => ({
    username,
    password
  }),
  loginSuccess: (token) => ({
    token
  }),
  loginFailed: (message) => ({
    message
  }),
});

const defaultState = {
  token: ''
};
export const reducer = handleActions({
  [actions.loginSuccess]: (prevState, { payload }) => ({
    ...prevState,
    token: payload.token
  })
}, defaultState);

function* doLogin({ payload }) {
  const {
    username,
    password
  } = payload;
  try {
    const token = yield call(login, username, password);
    setToken(token);
    yield put(actions.loginSuccess(token));
    yield call(getUsers);
  } catch (e) {
    yield put(actions.loginFailed(e));
  }
}

export function* saga() {
  yield takeEvery(actions.login, doLogin);
}
