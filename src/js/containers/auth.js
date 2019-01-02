import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

function mapStateToProps(state) {
  return {
    authenticated: state.auth.token !== null
  };
}

const Auth = (props) => {
  if (props.authenticated !== null) {
    return props.children;
  }
  return (
    <Redirect to="/login" />
  );
};

export default connect(mapStateToProps)(Auth);
