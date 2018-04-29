import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import AppBar from '../components/appbar/index.jsx';
import { actions as authActions } from '../modules/auth/action';
import { getUrlFromFile } from '../utils/consts';

function mapStateToProps(state) {
  return {
    current: state.common.current,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    gotoParent: (id) => {
      const url = getUrlFromFile('directory', id);
      dispatch(push(url));
    },
    logout: () => {
      dispatch(authActions.logout());
    }
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBar));
