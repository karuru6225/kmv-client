import { connect } from 'react-redux';
import Dummy from '../components/dummy.jsx';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps() {
  return { };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dummy);
