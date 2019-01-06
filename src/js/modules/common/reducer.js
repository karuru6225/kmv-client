import { handleActions } from 'redux-actions';
import { actionTypes } from './action';
import File from '../../models/file';

const defaultState = {
  loading: 0,
  current_file: (new File()).toJSON()
};

export default handleActions({
  [actionTypes.LOAD_START]: state => ({
    ...state,
    loading: state.loading + 1
  }),
  [actionTypes.LOAD_FINISH]: state => ({
    ...state,
    loading: Math.max(state.loading - 1, 0)
  }),
  [actionTypes.CHANGE_CURRENT]: (state, action) => ({
    ...state,
    current_file: action.payload
  }),
}, defaultState);
