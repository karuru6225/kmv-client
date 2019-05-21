import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import AppBase, {
  HIDE_STAR,
  STAR,
  STAR_BORDER
} from '../components/common/app-base.jsx';
import { actions as bookmarkActions } from '../modules/bookmark/action';
import File from '../models/file';
import { getUrlFromFile } from '../utils/consts';


function mapStateToProps(state) {
  const current = new File(state.common.current_file);
  let star = HIDE_STAR;
  console.log(current);
  if (current.type === 'directory') {
    if (current.isBookmarked) {
      star = STAR;
    } else {
      star = STAR_BORDER;
    }
  }
  return {
    current,
    isPlaying: !!state.bookmark.playing,
    star
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cd: (type, id) => {
      const url = getUrlFromFile(type, id);
      dispatch(push(url));
    },
    next_bookmark: () => {
      dispatch(bookmarkActions.next());
    },
    stop_play_bookmark: () => {
      dispatch(bookmarkActions.stop());
    },
    add_bookmark: (fileId) => {
      dispatch(bookmarkActions.add_to_list(null, fileId));
    },
    remove_bookmark: (fileId) => {
      dispatch(bookmarkActions.remove_from_list(null, fileId));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBase);
