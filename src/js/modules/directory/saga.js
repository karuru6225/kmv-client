import { takeLatest, call, put, cancelled } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { CancelToken } from 'axios';

import { actions, actionTypes } from './action';
import {
  actions as commonActions,
  actionTypes as commonActionTypes
} from '../common/action';
import axios from '../../utils/ajax';

function* loadDir(action) {
  let id = '';
  let type = 'dir';
  let api = null;
  let cancelApi = null;
  const cancelOption = {
    cancelToken: new CancelToken((c) => {
      cancelApi = c;
    })
  };
  switch (action.type) {
    case LOCATION_CHANGE:
      [, type, id = ''] = action.payload.pathname.match(/\/?([^/]+)(\/.*)?/) || [];
      if (type !== 'directory') {
        return;
      }
      console.log('locationchange in dir.saga');
      api = axios.get.bind(axios, `dir${id}`, cancelOption);
      break;
    case actionTypes.REFRESH:
      id = action.payload;
      api = axios.put.bind(axios, `dir/${id}`, cancelOption);
      break;
    case commonActionTypes.INIT:
    default:
      [, type, id = ''] = window.location.hash.match(/#\/?([^/]+)(\/.*)?/) || [];
      if (type !== 'directory') {
        return;
      }
      console.log('init in dir.saga');
      api = axios.get.bind(axios, `dir${id}`, cancelOption);
      break;
  }

  try {
    const result = yield call(api);
    const current = result.data.current || { name: '' };
    const files = result.data.files || [];
    yield put(commonActions.change_current(current));
    yield put(actions.load_success(files));
  } catch (e) {
    yield put(actions.load_failed());
  } finally {
    if (yield cancelled()) {
      cancelApi();
    }
  }
}

export default function* () {
  yield takeLatest([
    actionTypes.REFRESH,
    LOCATION_CHANGE,
    commonActionTypes.INIT
  ], loadDir);
}
