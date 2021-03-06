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

function* changeDirectory(fileId) {
  const result = yield call(file.get, fileId);
  const bookmarkList = yield select(s => s.bookmark.lists);
  let isBookmarked = false;
  if (bookmarkList.length > 0) {
    const fileList = bookmarkList.find(b => b.name === 'bookmark').files;
    console.log(fileList);
    isBookmarked = fileList.findIndex(f => f.id === fileId) !== -1;
  }
  yield put(actions.change_current({
    ...result.data,
    isBookmarked
  }));
}

function* changeCurrent(action) {
  const page = yield call(getPage);
  if (page) {
    const {
      type,
      id
    } = page.params;
    yield put(actions.reset_current());
    console.log('common.changeCurrent', page);
    switch (type) {
      case 'history': {
        yield put(actions.change_current({
          name: '履歴'
        }));
        break;
      }
      case 'bookmark': {
        yield put(actions.change_current({
          name: 'ブックマーク'
        }));
        break;
      }
      case 'directory':
      default: {
        try {
          const page = yield call(changeDirectory, id);
        } catch (e) {
          console.log(e);
        }
        break;
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

