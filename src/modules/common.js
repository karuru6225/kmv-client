import { handleActions } from 'redux-actions';
import {
  fork,
  call
} from 'redux-saga/effects';
// import {
//   getMe,
// } from '../api';
import {
  log
} from '../lib';

const defaultState = {};
export const reducer = handleActions({
}, defaultState);

function* init() {
// try {
//   yield call(getMe);
// } catch (e) {
//   log(e);
// }
}

export function* saga() {
  yield fork(init);
}
