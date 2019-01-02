import { connect } from 'react-redux';
import Login from '../components/login/index.jsx';
import { actions } from '../modules/auth/action';

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
    sending: state.common.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (username, password) => {
      dispatch(actions.login(username, password));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
