import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { actions as historyActions } from '../modules/history/action';
import { actions as bookmarkActions } from '../modules/bookmark/action';
import Movie from '../components/movie/index.jsx';
import File from '../models/file';
import { getUrlFromFile } from '../utils/consts';

function mapStateToProps(state) {
  return {
    current: new File(state.common.current_file),
    is_playing_bookmark: !!state.bookmark.playing,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    timeupdate: (id, sec) => {
      dispatch(historyActions.update(id, sec));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Movie);
