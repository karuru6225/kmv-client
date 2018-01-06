import { handleActions } from 'redux-actions';
import { actionTypes } from './action';
import { actionTypes as commonActionTypes } from '../common/action';
import axios from '../../utils/ajax';

const defaultState = {
  token: null,
  sending: false,
  errorMessage: ''
};

export default handleActions({
  [commonActionTypes.INIT]: () => {
    const token = localStorage.getItem(`${APPNAME}-token`);
    if (token) {
      axios.defaults.headers.common['x-kmv-token'] = token;
      return {
        ...defaultState,
        token
      };
    }
    return defaultState;
  },
  [actionTypes.LOGIN]: () => ({
    ...defaultState,
    sending: true
  }),
  [actionTypes.LOGIN_SUCCESS]: (_, action) => {
    axios.defaults.headers.common['x-kmv-token'] = action.payload;
    localStorage.setItem(`${APPNAME}-token`, action.payload);
    return {
      ...defaultState,
      token: action.payload
    };
  },
  [actionTypes.LOGIN_FAILED]: (_, action) => ({
    ...defaultState,
    errorMessage: action.payload
  }),
  [actionTypes.LOGOUT_SUCCESS]: () => {
    localStorage.removeItem(`${APPNAME}-token`);
    axios.defaults.headers.common['x-kmv-token'] = null;
    return defaultState;
  },
  [actionTypes.LOGOUT_FAILED]: () => {
    localStorage.removeItem(`${APPNAME}-token`);
    axios.defaults.headers.common['x-kmv-token'] = null;
    return defaultState;
  }
}, defaultState);
