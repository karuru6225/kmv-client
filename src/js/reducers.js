import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import common from './modules/common/reducer';
import auth from './modules/auth/reducer';
import dir from './modules/directory/reducer';

export default combineReducers({
  routing: routerReducer,
  common,
  auth,
  dir,
});

