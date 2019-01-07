import {
  takeLatest,
  call,
  put,
  select
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { matchPath } from 'react-router-dom';
import { actions, actionTypes } from '../common/action';
import { file } from '../../utils/ajax';

function* getPage() {
  const pathname = (yield select(state => state.router.location)).pathname;
  const authPages = matchPath(pathname, '/login') || matchPath(pathname, '/logout');
  if (authPages) {
    return false;
  }
  return matchPath(pathname, '/:type/:id')
    || matchPath(pathname, '/:type')
    || matchPath(pathname, '/');
}

function* changeCurrent(action) {
  const page = yield call(getPage);
  if (page) {
    const {
      type,
      id
    } = page.params;
    console.log(page.params);
    if (type === 'history') {
      yield put(actions.change_current({
        name: '履歴'
      }));
    } else {
      try {
        const result = yield call(file.get, id);
        yield put(actions.change_current(result.data));
      } catch (e) {
        console.log(e);
      }
    }
  }
}

export default function* () {
  yield takeLatest([
    LOCATION_CHANGE,
    actionTypes.INIT
  ], changeCurrent);
}

