import { takeEvery, call, put } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { actions, actionTypes } from './action';
import {
  actions as commonActions,
  actionTypes as commonActionTypes
} from '../common/action';
import axios from '../../utils/ajax';

function* loadDir(action) {
  let id = '';
  let api = null;
  let type = 'dir';
  switch (action.type) {
    case LOCATION_CHANGE:
      [, type, id = ''] = action.payload.pathname.match(/\/?([^/]+)(\/.*)?/) || [];
      if (type !== 'dir') {
        return;
      }
      api = axios.get.bind(axios, `dir${id}`);
      break;
    case actionTypes.REFRESH:
      id = action.payload;
      api = axios.put.bind(axios, `dir/${id}`);
      break;
    case commonActionTypes.INIT:
    default:
      [, type, id = ''] = window.location.hash.match(/#\/?([^/]+)(\/.*)?/) || [];
      if (type !== 'dir') {
        return;
      }
      api = axios.get.bind(axios, `dir${id}`);
      break;
  }

  yield put(commonActions.loadStart());
  try {
    const result = yield call(api);
    const current = result.data.current || { name: '' };
    const files = result.data.files || [];
    yield put(actions.load_success(current, files));
  } catch (e) {
    yield put(actions.load_failed());
  }
  yield put(commonActions.loadFinish());
}

export default function* () {
  yield takeEvery([
    actionTypes.REFRESH,
    LOCATION_CHANGE,
    commonActionTypes.INIT
  ], loadDir);
}
