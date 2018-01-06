import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Login from '../components/login/index.jsx';
import { actions } from '../modules/auth/action';

function mapStateToProps(state) {
  return state.auth;
}

function mapDispatchToProps(dispatch) {
  return {
    login: (username, password) => {
      dispatch(actions.login(username, password));
    }
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login));
