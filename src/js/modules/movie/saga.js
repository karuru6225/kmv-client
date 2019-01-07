import {
  takeLatest,
  call,
  put,
  cancel,
  fork,
  spawn,
  select
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';
import { matchPath } from 'react-router-dom';

import { actions, actionTypes } from './action';
import {
  actions as commonActions,
} from '../common/action';
import { book, history } from '../../utils/ajax';
import {
  extComponentMap,
  imageBufferLength,
  BOOK_NO_CACHE,
  BOOK_LOADING,
  BOOK_CACHED
} from '../../utils/consts';

function* timeupdate(action) {
  const {
    id
  } = yield select(state => state.common.current_file);
  const sec = action.payload;
  try {
    yield call(history.save, id, sec);
  } catch (e) { }
}

export default function* () {
  yield takeLatest(actionTypes.TIMEUPDATE, timeupdate);
}
