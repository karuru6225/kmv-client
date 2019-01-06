import { fork } from 'redux-saga/effects';
import common from './modules/common/saga';
import auth from './modules/auth/saga';
import dir from './modules/directory/saga';
import book from './modules/book/saga';

export default function* rootSaga() {
  yield fork(common);
  yield fork(auth);
  yield fork(dir);
  yield fork(book);
}
