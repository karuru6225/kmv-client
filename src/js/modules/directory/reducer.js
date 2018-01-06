import { handleActions } from 'redux-actions';
import { actionTypes } from './action';
import File from '../../models/file';

const defaultState = {
  current: new File({ name: '' }),
  files: [],
  errorMessage: ''
};

export default handleActions({
  [actionTypes.LOAD_SUCCESS]: (_, action) => {
    const files = action.payload.files || [];
    return {
      ...defaultState,
      current: new File(action.payload.current),
      files: files.map(f => new File(f)),
    };
  },
  [actionTypes.LOAD_FAILED]: (_, action) => ({
    ...defaultState,
    errorMessage: action.payload
  }),
}, defaultState);
