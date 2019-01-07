import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import FileList from '../components/common/file-list.jsx';
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
)(FileList);
