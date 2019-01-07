import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { actions } from '../modules/movie/action';
import Movie from '../components/movie/index.jsx';
import File from '../models/file';
import { getUrlFromFile } from '../utils/consts';

function mapStateToProps(state) {
  return {
    current: new File(state.common.current_file)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cd: (type, id) => {
      const url = getUrlFromFile(type, id);
      dispatch(push(url));
    },
    timeupdate: (sec) => {
      dispatch(actions.timeupdate(sec));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Movie);
