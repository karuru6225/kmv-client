import { handleActions } from 'redux-actions';
import { actionTypes } from './action';
import File from '../../models/file';

const defaultState = {
  files: [],
  sort_column: 'mtime',
  sort_desc: true
};

export default handleActions({
  [actionTypes.LOAD_SUCCESS]: (_, action) => {
    const files = action.payload || [];
    return {
      ...defaultState,
      files: files.map(f => (new File(f)).toJSON()),
    };
  },
  [actionTypes.RESET]: (_, action) => ({
    ...defaultState
  }),
  [actionTypes.LOAD_FAILED]: (_, action) => ({
    ...defaultState
  }),
  [actionTypes.SORT_CONDITION]: (prevState, action) => ({
    ...prevState,
    sort_column: action.payload.column,
    sort_desc: !!action.payload.desc
  })
}, defaultState);
