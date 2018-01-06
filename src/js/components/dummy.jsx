import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';

const Dummy = props => (
  <div>
    <Button
      raised
      color="primary"
      onClick={(e) => {
        e.preventDefault();
        props.logout();
      }}
    >
      ログアウト
    </Button>
  </div>
);

Dummy.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default Dummy;
