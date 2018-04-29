import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import Movie from '../components/movie/index.jsx';
import { actions } from '../modules/auth/action';

function mapStateToProps(state) {
  return {
    current: state.common.current,
  };
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
)(Movie);
