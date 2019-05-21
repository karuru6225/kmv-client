import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import FileList from '../components/common/file-list.jsx';
import { actions } from '../modules/directory/action';
import { actions as historyActions } from '../modules/history/action';
import { actions as bookmarkActions } from '../modules/bookmark/action';
import File from '../models/file';
import { getUrlFromFile } from '../utils/consts';

function mapStateToProps(state) {
  return {
    current: new File(state.common.current_file),
    files: state.directory.files.map(f => new File(f)),
    sort_column: state.directory.sort_column,
    sort_desc: state.directory.sort_desc,
    is_playing_bookmark: !!state.bookmark.playing,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cd: (type, id, index = 0) => {
      const url = getUrlFromFile(type, id);
      let params = {
        pathname: url
      };
      if (index !== 0) {
        params = {
          search: `?index=${index}`,
          pathname: url,
        };
      }
      dispatch(push(params));
    },
    select_bookmark_list: (id) => {
      dispatch(push(`bookmark/${id}`));
    },
    delete_bookmark_list: (id) => {
      console.log(`del bl ${id}`);
    },
    play_bookmark_list: (id) => {
      dispatch(bookmarkActions.play(id));
    },
    next_bookmark: () => {
      dispatch(bookmarkActions.next());
    },
    delete_bookmark: (id) => {
      dispatch(bookmarkActions.remove_from_list(null, id));
    },
    refresh: () => {
      dispatch(actions.refresh());
    },
    delete_history: (id) => {
      dispatch(historyActions.delete(id));
    },
    clear_history: () => {
      dispatch(historyActions.deleteAll());
    },
    sort_condition: (column, desc) => {
      dispatch(actions.sort_condition(column, desc));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileList);
