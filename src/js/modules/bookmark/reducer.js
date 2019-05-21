import { handleActions } from 'redux-actions';
import { actionTypes } from './action';
import File from '../../models/file';

const defaultState = {
  initialized: false,
  playing: null,
  files: [],
  index: 0,
  lists: []
};

export default handleActions({
  [actionTypes.LOADED_LISTS]: (prevState, action) => ({
    ...prevState,
    initialized: true,
    lists: action.payload
  }),
  [actionTypes.PLAY]: (_, action) => ({
    ...defaultState,
    playing: action.payload,
  }),
  [actionTypes.STORE_PLAYLIST]: (prevState, action) => {
    const files = action.payload || [];
    return {
      ...prevState,
      index: 0,
      files: files.map(f => (new File(f)).toJSON()),
    };
  },
  [actionTypes.NEXT]: (prevState) => ({
    ...prevState,
    index: prevState.index + 1
  }),
  [actionTypes.STOP]: () => defaultState,
}, defaultState);
