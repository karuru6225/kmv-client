import { connect } from 'react-redux';
import Login from '../components/login.jsx';
import { actions } from '../modules/auth';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  login: (username, password) => {
    dispatch(actions.login(username, password));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
