import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import Book from '../components/book/index.jsx';
import { actions } from '../modules/book/action';
import { actions as bookmarkActions } from '../modules/bookmark/action';
import File from '../models/file';
import { getUrlFromFile } from '../utils/consts';

function mapStateToProps(state) {
  const pageCount = state.book.pageCount;
  const page = Math.min(pageCount - 1, state.book.page);
  let prevDiff = 2;
  let nextDiff = 2;
  let singleMode = false;
  if (pageCount > 0 && state.book.images.length > 0) {
    if (page > 1) {
      const p1Img = state.book.images[page - 1];
      const p2Img = state.book.images[page - 2];
      if (p1Img && p1Img.width > p1Img.height
        || p2Img && p2Img.width > p2Img.height) {
        prevDiff = 1;
      }
    }
    const c1Img = state.book.images[page];
    if (c1Img && c1Img.width > c1Img.height) {
      nextDiff = 1;
      singleMode = true;
    }
    if (pageCount - 1 > page) {
      const c2Img = state.book.images[page + 1];
      if (c2Img && c2Img.width > c2Img.height) {
        nextDiff = 1;
        singleMode = true;
      }
    }
  }

  return {
    pageCount: state.book.pageCount,
    page: state.book.page,
    cacheStatus: state.book.cacheStatus,
    images: state.book.images,
    reverse: state.book.reverse,
    prevDiff,
    nextDiff,
    singleMode
  };
}

function mapDispatchToProps(dispatch) {
  return {
    change_page: (page) => {
      dispatch(actions.change_page(page));
    },
    toggle_reverse: () => {
      dispatch(actions.toggle_reverse());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Book);
