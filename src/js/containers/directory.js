import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Directory from '../components/directory/index.jsx';
import { actions } from '../modules/directory/action';
import File from '../models/file';
import { getUrlFromFile } from '../utils/consts';

function mapStateToProps(state) {
  return {
    current: new File(state.common.current_file),
    files: state.directory.files.map(f => new File(f)),
    sort_column: state.directory.sort_column,
    sort_desc: state.directory.sort_desc
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cd: (type, id) => {
      const url = getUrlFromFile(type, id);
      dispatch(push(url));
    },
    refresh: () => {
      dispatch(actions.refresh());
    },
    sort_condition: (column, desc) => {
      dispatch(actions.sort_condition(column, desc));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Directory);
