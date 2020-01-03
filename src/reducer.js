import { combineReducers } from 'redux';
import { reducer as auth } from './modules/auth';
import { connectRouter } from 'connected-react-router';
import { log } from './lib';

export default (history) => combineReducers({
  debug: (_, action) => log(action) || {},
  auth,
  router: connectRouter(history),
});
