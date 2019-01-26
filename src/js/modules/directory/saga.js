import {
  takeLatest,
  call,
  put,
  select
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { matchPath } from 'react-router-dom';

import { actions, actionTypes } from './action';
import {
  actions as commonActions,
} from '../common/action';
import { directory } from '../../utils/ajax';

function* getDirPage() {
  const pathname = (yield select(state => state.router.location)).pathname;
  return matchPath(pathname, '/directory/:id')
    ||  matchPath(pathname, '/directory')
    || matchPath(pathname, {
      path: '/',
      exact: true
    });
}

function* loadDir(api) {
  const dirPage = yield call(getDirPage);
  if (dirPage) {
    const {
      id
    } = dirPage.params;
    yield put(actions.reset());
    try {
      const result = yield call(api, id);
      const files = result.data.files || [];
      yield put(actions.load_success(files));
    } catch (e) {
      yield put(actions.load_failed());
    }
  }
}

export default function* () {
  yield takeLatest([
    LOCATION_CHANGE
  ], loadDir, directory.get);
  yield takeLatest([
    actionTypes.REFRESH,
  ], loadDir, directory.refresh);
}
