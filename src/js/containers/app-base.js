import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import AppBase from '../components/common/app-base.jsx';
import { actions as bookmarkActions } from '../modules/bookmark/action';
import File from '../models/file';
import { getUrlFromFile } from '../utils/consts';

function mapStateToProps(state) {
  return {
    current: new File(state.common.current_file),
    isPlaying: !!state.bookmark.playing,
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBase);
