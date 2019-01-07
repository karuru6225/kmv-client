import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import Book from '../components/book/index.jsx';
import { actions } from '../modules/book/action';
import File from '../models/file';
import { getUrlFromFile } from '../utils/consts';

function mapStateToProps(state) {
  return {
    current: new File(state.common.current_file),
    pageCount: state.book.pageCount,
    page: state.book.page,
    images: state.book.images,
    reverse: state.book.reverse,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cd: (type, id) => {
      const url = getUrlFromFile(type, id);
      dispatch(push(url));
    },
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
