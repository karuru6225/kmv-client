import { fork } from 'redux-saga/effects';
import { saga as auth } from './modules/auth';
import { saga as common } from './modules/common';

export default function* saga() {
  yield fork(common);
  yield fork(auth);
}
