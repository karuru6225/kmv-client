import {
  takeLatest,
  call,
  put,
  select
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { matchPath } from 'react-router-dom';

import { actionTypes } from './action';
import { actions as directoryActions } from '../directory/action';
import { history } from '../../utils/ajax';

function* getHistoryPage() {
  const pathname = (yield select(state => state.router.location)).pathname;
  return matchPath(pathname, '/history');
}

function* locationChange() {
  const historyPage = yield call(getHistoryPage);
  if (historyPage) {
    yield put(directoryActions.reset());
    try {
      const result = yield call(history.getList);
      yield put(directoryActions.load_success(result.data));
    } catch (e) {
      yield put(directoryActions.load_failed());
    }
  }
}

function* update(action) {
  const {
    index, 
    id
  } = action.payload;
  try {
    yield call(history.save, id, index);
  } catch (e) { }
}

function* deleteHistory(action) {
  const id = action.payload;
  try {
    const result = yield call(history.delete, id);
    yield put(directoryActions.load_success(result.data));
  } catch (e) { }
}

function* deleteAllHistory(action) {
  const id = action.payload;
  try {
    yield call(history.clear, id);
    yield put(directoryActions.load_success([]));
  } catch (e) { }
}

export default function* () {
  yield takeLatest(LOCATION_CHANGE, locationChange);
  yield takeLatest(actionTypes.UPDATE, update);
  yield takeLatest(actionTypes.DELETE, deleteHistory);
  yield takeLatest(actionTypes.DELETE_ALL, deleteAllHistory);
}
