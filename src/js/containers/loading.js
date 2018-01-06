import { connect } from 'react-redux';
import Loading from '../components/loading/index.jsx';

function mapStateToProps(state) {
  return {
    ...state.common
  };
}

export default connect(mapStateToProps)(Loading);
