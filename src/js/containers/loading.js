import { connect } from 'react-redux';
import Loading from '../components/common/loading.jsx';

function mapStateToProps(state) {
  return {
    loading: state.common.loading !== 0
  };
}

function mapDispatchToProps() {
  return { };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading);
