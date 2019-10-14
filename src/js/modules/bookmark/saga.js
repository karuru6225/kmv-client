import {
  takeLatest,
  call,
  put,
  select
} from 'redux-saga/effects';
import {
  delay
} from 'redux-saga';
import { push, LOCATION_CHANGE } from 'react-router-redux';
import { matchPath } from 'react-router-dom';

import { actions, actionTypes } from './action';
import { actions as directoryActions } from '../directory/action';
import { actionTypes as commonActionTypes } from '../common/action';
import { bookmark } from '../../utils/ajax';
import File from '../../models/file';

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
  while (true) {
    const initialized = yield select(s => s.bookmark.initialized);
    if (initialized) {
      break;
    }
    yield delay(100);
  };
  if (bookmarkPage) {
    const {
      id
    } = bookmarkPage.params;
    yield put(directoryActions.reset());
    const lists = yield select(s => s.bookmark.lists);
    const list = lists.find(l => l.id === id);
    if (list) {
      console.log(list.files);
      yield put(directoryActions.load_success(list.files));
    }
  } else if (bookmarkListPage) {
    yield put(directoryActions.reset());
    const lists = yield select(s => s.bookmark.lists);
    yield put(directoryActions.load_success(lists));
  }
}

function* play(action) {
  const id = action.payload;
  try {
    const result = yield call(bookmark.getFiles, id);
    const files = result.data.sort((a, b) => {
      return b.mtime.localeCompare(a.mtime);
    });
    console.log(files);
    for (let i = files.length - 1; i > 0; i--) {
      const tgtIdx = Math.floor(Math.random() * (i + 1));
      // const tgtIdx = Math.floor((1 - Math.random() * Math.random()) * (i + 1));
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
  } catch (e) {
    console.log(e);
  }
}

function* removeBookmark(action) {
  const id = action.payload;
  try {
    console.log(id);
  } catch (e) {
    console.log(e);
  }
}

function* getListFiles(list) {
  const {
    id,
    name
  } = list;
  const files = (yield call(bookmark.get, id)).data.files;
  return {
    id,
    name,
    files: files.map(f => (new File(f)).toJSON())
  };
}

function* loadAllLists() {
  try {
    const lists = (yield call(bookmark.getList)).data;
    const joinedLists = [];
    for (let i = 0; i < lists.length; i += 1) {
      joinedLists.push(yield call(getListFiles, lists[i]));
    }
    yield put(actions.loaded_lists(joinedLists));
  } catch (e) {
    console.log(e);
  }
}

function* add2List(action) {
  const {
    fileId
  } = action.payload;
  const bookmarkList = yield select(s => s.bookmark.lists);
  if (bookmarkList.length > 0) {
    try {
      const bookmarkId = bookmarkList.find(b => b.name === 'bookmark').id;
      console.log({bookmarkId, fileId});
      yield call(bookmark.addFile, bookmarkId, fileId);
      yield call(loadAllLists);
    } catch (e) {
      console.log(e);
    }
  }
}

function* removeFromList(action) {
  const {
    fileId
  } = action.payload;
  const bookmarkList = yield select(s => s.bookmark.lists);
  if (bookmarkList.length > 0) {
    try {
      const bookmarkId = bookmarkList.find(b => b.name === 'bookmark').id;
      console.log({bookmarkId, fileId});
      yield call(bookmark.removeFile, bookmarkId, fileId);
      yield call(loadAllLists);
    } catch (e) {
      console.log(e);
    }
  }
}

function* init() {
  yield call(loadAllLists);
}

export default function* () {
  yield takeLatest(commonActionTypes.INIT, init);
  yield takeLatest(LOCATION_CHANGE, locationChange);
  yield takeLatest(actionTypes.ADD, add);
  yield takeLatest(actionTypes.REMOVE, removeBookmark);
  yield takeLatest(actionTypes.PLAY, play);
  yield takeLatest(actionTypes.NEXT, next);
  yield takeLatest(actionTypes.ADD_TO_LIST, add2List);
  yield takeLatest(actionTypes.REMOVE_FROM_LIST, removeFromList);
}
