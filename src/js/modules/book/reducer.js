import { handleActions } from 'redux-actions';
import { actionTypes } from './action';
import File from '../../models/file';

const defaultState = {
  type: '',
  id: '',
  pageCount: 0,
  cacheStatus: '',
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
      id,
      page,
      image
    } = action.payload;
    if (prevState.pageCount <= 0
    || prevState.pageCount <= page
    || prevState.id !== id ) {
      console.log(`${prevState.id} !== ${id}`);
      console.log('id miss match');
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
    const cacheArry = prevState.cacheStatus.split(',');
    const {
      id,
      page,
      state
    } = action.payload;
    if (prevState.id !== id) {
      console.log(`${prevState.id} !== ${id}`);
      console.log('id miss match');
      return prevState;
    }
    cacheArry[page] = state;
    return {
      ...prevState,
      cacheStatus: cacheArry.join(',')
    };
  },
}, defaultState);
