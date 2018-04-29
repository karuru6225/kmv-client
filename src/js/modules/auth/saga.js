import { takeEvery, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { actions, actionTypes } from './action';
import axios from '../../utils/ajax';

function* login(action) {
  try {
    const result = yield call(axios.post.bind(axios, 'auth', {
      username: action.payload.username,
      password: action.payload.password
    }));
    yield put(actions.login_success(result.data.token));
    if (action.payload.state) {
      yield put(push(action.payload.state.from.pathname));
    } else {
      yield put(push('/'));
    }
  } catch (e) {
    yield put(actions.login_failed());
  }
}

function* logout() {
  try {
    yield call(axios.delete.bind(axios, 'auth'));
    yield put(actions.logout_success());
    yield put(push('/login'));
  } catch (e) {
    yield put(actions.logout_failed());
  }
}

export default function* () {
  yield takeEvery(actionTypes.LOGIN, login);
  yield takeEvery(actionTypes.LOGOUT, logout);
}
