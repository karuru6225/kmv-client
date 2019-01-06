import { combineReducers } from 'redux';
import common from './modules/common/reducer';
import auth from './modules/auth/reducer';
import directory from './modules/directory/reducer';
import book from './modules/book/reducer';
import { connectRouter } from 'connected-react-router';

export default (history) => combineReducers({
  common,
  auth,
  directory,
  book,
  router: connectRouter(history)
});
