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
import { book, bookmark } from '../../utils/ajax';
import {
  extComponentMap,
  imageBufferLength,
  BOOK_NO_CACHE,
  BOOK_LOADING,
  BOOK_CACHED
} from '../../utils/consts';

const bookExts = extComponentMap.find((c) => c.key === 'book').exts;

function* getPage() {
  const pathname = (yield select(state => state.router.location)).pathname;
  return matchPath(pathname, '/:type/:id');
}

function* loadMeta() {
  const bookPage = yield call(getPage);
  if (bookPage) {
    const {
      type,
      id
    } = bookPage.params;
    if (bookExts.indexOf(type) === -1) {
      return;
    }
    let page = 0;
    if (location.search.length !== 0) {
      const qparams = {};
      location.search.substr(1).split('&').forEach((kv) => {
        const [
          key, value
        ] = kv.split('=');
        qparams[key] = value;
      });
      if (qparams.index) {
        page = parseInt(qparams.index);
      }
    }
    yield put(actions.reset());
    try {
      const result = yield call(book.getMeta, type, id);
      yield put(actions.loaded_meta(type, id, result.data.fileCount, page));
      loadImagesTask = yield fork(loadImages, type, id, page);
    } catch (e) { }
  }
}

let loadImagesTask = null;
function* cancelLoad() {
  if (loadImagesTask && loadImagesTask.isRunning()) {
    yield cancel(loadImagesTask);
    loadImagesTask = null;
  }
}

function* changePage(action) {
  const {
    type, 
    id
  } = yield select(state => state.book);
  const page = action.payload;
  try {
    yield call(bookmark.save, id, page);
  } catch (e) { }
  yield call(cancelLoad);
  loadImagesTask = yield fork(loadImages, type, id, page);
}

function* loadImages(type, id, page) {
  const cached = (yield select(state => state.book.cached)).split(',');
  const {
    pageCount
  } = yield select(state => state.book);
  if (pageCount === 0) {
    return;
  }
  for(let i = -4; i < imageBufferLength - 4; i++) {
    const targetIndex = (page + i + pageCount) % pageCount;
    if (cached[targetIndex] === BOOK_LOADING
      || cached[targetIndex] === BOOK_CACHED ) {
      continue;
    }
    yield put(actions.update_cache(targetIndex, BOOK_LOADING));
    yield spawn(loadImage, type, id, targetIndex);
  }
}

function* loadImage(type, id, page, iter = 0) {
  try {
    const image = yield call(book.getImage, type, id, page, 3/4);
    yield put(actions.loaded_image(page, image));
    yield put(actions.update_cache(page, BOOK_CACHED));
  } catch(e) {
    yield put(actions.update_cache(page, BOOK_NO_CACHE));
    if (iter < 5) {
      yield spawn(loadImage, type, id, page, iter + 1);
    }
  }
}

export default function* () {
  yield takeLatest([
    LOCATION_CHANGE
  ], loadMeta);
  yield takeLatest(actionTypes.CHANGE_PAGE, changePage);
}
