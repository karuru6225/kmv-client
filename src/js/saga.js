import { fork } from 'redux-saga/effects';
import authSaga from './modules/auth/saga';
import dirSaga from './modules/directory/saga';

export default function* rootSaga() {
  yield fork(authSaga);
  yield fork(dirSaga);
}
