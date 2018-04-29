import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import Dummy from '../components/dummy.jsx';
import { actions } from '../modules/auth/action';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => {
      dispatch(goBack());
    },
    logout: () => {
      dispatch(actions.logout());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dummy);
