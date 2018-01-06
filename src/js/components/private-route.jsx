import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import store from '../store';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(routeProps) => {
      const { token } = store.getState().auth;
      if (token === null) {
        return (
          <Redirect to={{
              pathname: '/login',
              state: { from: routeProps.location }
            }}
          />
        );
      }
      return (
        <Component {...routeProps} />
      );
    }}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};

export default PrivateRoute;
