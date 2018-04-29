import { handleActions } from 'redux-actions';
import { actionTypes } from './action';
import File from '../../models/file';

const defaultState = {
  loading: false,
  current: (new File({ name: '' })).toJSON(),
};

export default handleActions({
  [actionTypes.CHANGE_CURRENT]: (state, action) => ({
    ...state,
    current: (new File(action.payload)).toJSON()
  }),
  [actionTypes.LOAD_START]: state => ({
    ...state,
    loading: true
  }),
  [actionTypes.LOAD_FINISH]: state => ({
    ...state,
    loading: false
  }),
}, defaultState);
