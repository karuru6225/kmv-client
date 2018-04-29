import { LOCATION_CHANGE } from 'react-router-redux';
import { actions, actionTypes } from '../common/action';

function* changeCurrent(action) {
  let app = '';
  let type = '';
  let id = '';

  switch (action.type) {
    case LOCATION_CHANGE:
      [, type, id = ''] = action.payload.pathname.match(/^\/?([^/]+)(\/.*)?(\/.*)?/) || [];
      api = axios.get.bind(axios, `dir${id}`, cancelOption);
      break;
    case commonActionTypes.INIT:
    default:
      console.log('init in common.saga');
      [, type, id = ''] = window.location.hash.match(/^#\/?([^/]+)(\/.*)?/) || [];
      api = axios.get.bind(axios, `dir${id}`, cancelOption);
      break;
  }
}

export default function* () {
  yield takeLatest([
    LOCATION_CHANGE,
    actionTypes.INIT
  ], changeCurrent);
}

