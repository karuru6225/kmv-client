import { connect } from 'react-redux';
import Dummy from '../components/dummy.jsx';
import { actions } from '../modules/auth/action';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      dispatch(actions.logout());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dummy);
