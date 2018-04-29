import { handleActions } from 'redux-actions';
import { actionTypes } from './action';
import File from '../../models/file';

const defaultState = {
  files: [],
  errorMessage: ''
};

export default handleActions({
  [actionTypes.LOAD_SUCCESS]: (_, action) => {
    const files = action.payload || [];
    return {
      ...defaultState,
      files: files.map(f => (new File(f)).toJSON()),
    };
  },
  [actionTypes.LOAD_FAILED]: (_, action) => ({
    ...defaultState,
    errorMessage: action.payload
  }),
}, defaultState);
