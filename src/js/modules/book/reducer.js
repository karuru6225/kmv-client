import { handleActions } from 'redux-actions';
import { actionTypes } from './action';
import File from '../../models/file';

const defaultState = {
  type: '',
  id: '',
  pageCount: 0,
  cached: '',
  images: [],
  page: 0,
  reverse: true
};

export default handleActions({
  [actionTypes.RESET]: () => defaultState,
  [actionTypes.LOADED_META]: (prevState, action) => {
    console.log(action);
    return {
      ...defaultState,
      id: action.payload.id,
      type: action.payload.type,
      pageCount: parseInt(action.payload.pageCount),
      page: parseInt(action.payload.page),
    };
  },
  [actionTypes.CHANGE_PAGE]: (prevState, action) => {
    if (prevState.pageCount <= 0) {
      return prevState;
    }
    return {
      ...prevState,
      page: Math.min(Math.max(action.payload, 0), prevState.pageCount - 1)
    };
  },
  [actionTypes.TOGGLE_REVERSE]: (prevState) => ({
    ...prevState,
    reverse: !prevState.reverse
  }),
  [actionTypes.LOADED_IMAGE]: (prevState, action) => {
    const {
      page,
      image
    } = action.payload;
    if (prevState.pageCount <= 0
    || prevState.pageCount <= page) {
      return prevState;
    }
    const newImages = prevState.images.slice();
    newImages[page] = image;
    return {
      ...prevState,
      images: newImages
    };
  },
  [actionTypes.UPDATE_CACHE]: (prevState, action) => {
    const cacheArry = prevState.cached.split(',');
    const {
      page,
      state
    } = action.payload;
    cacheArry[page] = state;
    return {
      ...prevState,
      cached: cacheArry.join(',')
    };
  },
}, defaultState);
