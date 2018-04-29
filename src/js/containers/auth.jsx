import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Auth from '../components/auth.jsx';

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default withRouter(connect(mapStateToProps)(Auth));
