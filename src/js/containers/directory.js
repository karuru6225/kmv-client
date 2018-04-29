import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import Directory from '../components/directory/index.jsx';
import { actions } from '../modules/directory/action';
import { getUrlFromFile } from '../utils/consts';

function mapStateToProps(state) {
  return {
    ...state.dir,
    current: state.common.current,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleSelected: (type, id) => {
      const url = getUrlFromFile(type, id);
      dispatch(push(url));
    },
    refresh: (id) => {
      dispatch(actions.refresh(id));
    }
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Directory));
