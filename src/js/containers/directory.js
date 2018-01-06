import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import Directory from '../components/directory/index.jsx';
import { actions } from '../modules/directory/action';
import { actions as authActions } from '../modules/auth/action';
import { getUrlFromFile } from '../utils/consts';

function mapStateToProps(state) {
  return {
    ...state.dir
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleSelected: (file) => {
      const url = getUrlFromFile(file);
      dispatch(push(url));
    },
    refresh: (id) => {
      dispatch(actions.refresh(id));
    },
    logout: () => {
      dispatch(authActions.logout());
    }
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Directory));
