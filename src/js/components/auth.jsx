import React from 'react';
import { Redirect } from 'react-router-dom';

const Auth = (props) => {
  if (props.auth.token === null) {
    return <Redirect to="/login" />;
  }
  return props.children;
};

export default Auth;
