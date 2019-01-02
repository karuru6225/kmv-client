import { handleActions } from 'redux-actions';
import { actionTypes } from './action';
import { setToken, clearToken } from '../../utils/ajax';

const defaultState = {
  token: null,
  sending: false,
  errorMessage: ''
};

export default handleActions({
  [actionTypes.LOGIN]: () => ({
    ...defaultState,
    sending: true
  }),
  [actionTypes.LOGIN_SUCCESS]: (_, action) => {
    setToken(action.payload);
    return {
      ...defaultState,
      token: action.payload
    };
  },
  [actionTypes.LOGIN_FAILED]: (_, action) => ({
    ...defaultState,
    errorMessage: action.payload
  }),
  [actionTypes.LOGOUTED]: () => {
    clearToken();
    return defaultState;
  }
}, defaultState);
