import { handleActions } from 'redux-actions';
import { actionTypes } from './action';

const defaultState = {
  loading: false,
};

export default handleActions({
  [actionTypes.LOAD_START]: () => ({
    ...defaultState,
    loading: true
  }),
  [actionTypes.LOAD_FINISH]: () => ({
    ...defaultState,
    loading: false
  }),
}, defaultState);
