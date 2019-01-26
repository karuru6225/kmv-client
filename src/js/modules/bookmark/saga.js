import {
  takeLatest,
  call,
  put,
  select
} from 'redux-saga/effects';
import { push, LOCATION_CHANGE } from 'react-router-redux';
import { matchPath } from 'react-router-dom';

import { actions, actionTypes } from './action';
import { actions as directoryActions } from '../directory/action';
import { bookmark } from '../../utils/ajax';

function* getBookmarkListPage() {
  const pathname = (yield select(state => state.router.location)).pathname;
  return matchPath(pathname, '/bookmark');
}

function* getBookmarkPage() {
  const pathname = (yield select(state => state.router.location)).pathname;
  return matchPath(pathname, '/bookmark/:id');
}

function* locationChange() {
  const bookmarkListPage = yield call(getBookmarkListPage);
  const bookmarkPage = yield call(getBookmarkPage);
  if (bookmarkPage) {
    yield put(directoryActions.reset());
    const {
      id
    } = bookmarkPage.params;
    try {
      const result = yield call(bookmark.get, id);
      yield put(directoryActions.load_success(result.data.files));
    } catch (e) {
      yield put(directoryActions.load_failed());
    }
  } else if (bookmarkListPage) {
    yield put(directoryActions.reset());
    try {
      const result = yield call(bookmark.getList);
      yield put(directoryActions.load_success(result.data));
    } catch (e) {
      yield put(directoryActions.load_failed());
    }
  }
}

function* play(action) {
  const id = action.payload;
  try {
    const result = yield call(bookmark.getFiles, id);
    const files = result.data;
    for (let i = files.length - 1; i > 0; i--) {
      const tgtIdx = Math.floor(Math.random() * (i + 1));
      const tmp = files[i];
      files[i] = files[tgtIdx];
      files[tgtIdx] = tmp;
    }
    yield put(actions.store_playlist(files));
    yield put(push(`/${files[0].type}/${files[0].id}`));
  } catch (e) {
    console.log(e);
  }
}

function* next() {
  const index = yield select(state => state.bookmark.index);
  const files = yield select(state => state.bookmark.files);
  yield put(push(`/${files[index].type}/${files[index].id}`));
}

function* add(action) {
  const id = action.payload;
  try {
    console.log(id);
  } catch (e) { }
}

function* removeBookmark(action) {
  const id = action.payload;
  try {
    console.log(id);
  } catch (e) { }
}

export default function* () {
  yield takeLatest(LOCATION_CHANGE, locationChange);
  yield takeLatest(actionTypes.ADD, add);
  yield takeLatest(actionTypes.REMOVE, removeBookmark);
  yield takeLatest(actionTypes.PLAY, play);
  yield takeLatest(actionTypes.NEXT, next);
}
