import {
  takeEvery,
  call,
  put,
  select
} from 'redux-saga/effects';
import { push, LOCATION_CHANGE } from 'react-router-redux';
import { matchPath } from 'react-router-dom';

import { actions, actionTypes } from './action';
import { auth } from '../../utils/ajax';

function* login(action) {
  try {
    const {
      username,
      password
    } = action.payload;
    const result = yield call(auth.login, username, password);
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
    yield call(auth.logout);
  } catch (e) { }
  yield put(actions.logouted());
  yield put(push('/login'));
}

function* locationChange(action) {
  const rLocation = yield select(state => state.router.location);
  const logoutPage = matchPath(rLocation.pathname, '/logout');
  if (logoutPage) {
    yield call(logout);
  }
}

export default function* () {
  yield takeEvery(actionTypes.LOGIN, login);
  yield takeEvery(actionTypes.LOGOUT, logout);
  yield takeEvery(LOCATION_CHANGE, locationChange);
}
