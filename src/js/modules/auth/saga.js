import { takeEvery, call, put } from 'redux-saga/effects';
import { push, replace } from 'react-router-redux';

import { actions, actionTypes } from './action';
import { actions as commonActions } from '../common/action';
import axios from '../../utils/ajax';

function* login(action) {
  yield put(commonActions.loadStart());
  try {
    const result = yield call(axios.post.bind(axios, 'auth', {
      username: action.payload.username,
      password: action.payload.password
    }));
    yield put(actions.login_success(result.data.token));
    yield put(replace('/'));
  } catch (e) {
    yield put(actions.login_failed());
  }
  yield put(commonActions.loadFinish());
}

function* logout() {
  yield put(commonActions.loadStart());
  try {
    yield call(axios.delete.bind(axios, 'auth'));
    yield put(actions.logout_success());
    yield put(push('/login'));
  } catch (e) {
    yield put(actions.logout_failed());
  }
  yield put(commonActions.loadFinish());
}

export default function* () {
  yield takeEvery(actionTypes.LOGIN, login);
  yield takeEvery(actionTypes.LOGOUT, logout);
}
